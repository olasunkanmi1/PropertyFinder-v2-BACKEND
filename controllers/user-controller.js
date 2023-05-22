import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import crypto from 'crypto'

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
  
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new UnAuthenticatedError('Invalid Credentials');
    }
    user.password = newPassword;
  
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
  const emailChanged = email !== user.email
  if(user.isVerified && emailChanged) {
   user.isVerified = false;
   user.verificationToken = crypto.randomBytes(40).toString('hex');;
  }

  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
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