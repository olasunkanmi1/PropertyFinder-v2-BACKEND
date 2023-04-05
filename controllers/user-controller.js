import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'
import { createTokenUser, attachCookiesToResponse, } from '../utils/index.js';
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
  
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
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

const updateUserImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: 'propertyfinder-bayut'
  });

  fs.unlinkSync(req.files.image.tempFilePath); //remove tmp files
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url }});
}

export { showCurrentUser, updateUser, updateUserPassword, updateUserImage }