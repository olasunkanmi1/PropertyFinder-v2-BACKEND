import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError, ConflictError } from '../errors/index.js'
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import generateCode from '../utils/generate-code.js';

// SHOW CURRENT USER
const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
};

// UPDATE USER PASSWORD
const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new BadRequestError('Please provide both values');
    }
    const user = await User.findOne({ _id: req.user.userId }).select('+password');
  
    const isPasswordCorrect = await user.comparePassword(oldPassword.toLowerCase());
    if (!isPasswordCorrect) {
      throw new UnAuthenticatedError('Invalid Credentials');
    }
    user.password = newPassword.toLowerCase();
  
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

// UPDATE USER
const updateUser = async (req, res) => {
  const { email, firstName, lastName, photoUrl } = req.query.withFormData === 'true' ? req.query : req.body;
  if (!email || !firstName || !lastName) {
    throw new BadRequestError('Please provide all values');
  }
  
  const {fieldsAndFreshImage, fieldsAndDeletePrevAndUploadNew} = req.query
  const {fieldsAndDeletePrevWithoutUploadNew} = req.body;
  const {public_id} = req.query.withFormData === 'true' ? req.query : req.body;

  const formDataExist = fieldsAndFreshImage || fieldsAndDeletePrevAndUploadNew
  const imgToDeleteExist = fieldsAndDeletePrevAndUploadNew || fieldsAndDeletePrevWithoutUploadNew
  
  const user = await User.findOne({ _id: req.user.userId });
  const emailChanged = email.toLowerCase() !== user.email
  const  userAlreadyExists = await User.findOne({ email });

  if(userAlreadyExists && emailChanged) {
      throw new ConflictError('Email already exist');
  }

  if(user.isVerified && emailChanged) {
   user.isVerified = false;
   user.verificationCode = generateCode();
  }

  user.email = email.toLowerCase();
  user.firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  user.lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
  user.photoUrl = formDataExist ? photoUrl.slice(1) : photoUrl;

  if(imgToDeleteExist) {
    await cloudinary.uploader.destroy(public_id);
    user.photoUrl = ''
  } 

  // UPLOAD IMAGE
  if(formDataExist) {
    try {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true,
        folder: 'propertyfinder-bayut',
        upload_preset: 'pf-bayut'
      });
    
      fs.unlinkSync(req.files.image.tempFilePath); //remove tmp files
      user.photoUrl = result.secure_url
    } catch (error) {
      //reupload deleted image if imgToDeleteExist && formDataExist but deletion was already successful
      if(imgToDeleteExist) {
        await cloudinary.api.restore([public_id]);
        user.photoUrl = photoUrl.slice(1)
      }
    }
  }

  await user.save();
  res.status(StatusCodes.OK).json({ user, msg: 'Profile updated successfully' });
};

export { showCurrentUser, updateUserPassword, updateUser }