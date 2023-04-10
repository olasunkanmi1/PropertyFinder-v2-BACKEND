import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

// SHOW CURRENT USER
const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
};

// UPDATE USER
const updateUser = async (req, res) => {
    const { email, firstName, lastName, photoUrl } = req.body;
    if (!email || !firstName || !lastName) {
      throw new BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ _id: req.user.userId });
  
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.photoUrl = photoUrl;
  
    await user.save();
  
    res.status(StatusCodes.OK).json({ msg: 'Profile updated successfully' });
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

// UPLOAD IMAGE
const updateUserImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: 'propertyfinder-bayut',
    upload_preset: 'pf-bayut'
  });

  fs.unlinkSync(req.files.image.tempFilePath); //remove tmp files
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url }});
}

// DELETE IMAGE
const deleteUserImage = async (req, res) => {
  const { public_id } = req.params;
  const decodedPublicId = decodeURIComponent(public_id);

  await cloudinary.uploader.destroy(decodedPublicId);
  return res.status(StatusCodes.OK).json({ msg: 'Success! Image Deleted.'});
}

export { showCurrentUser, updateUser, updateUserPassword, updateUserImage, deleteUserImage }