import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'
import { createTokenUser, attachCookiesToResponse, } from '../utils/index.js';

// SHOW CURRENT USER
const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
};

// UPDATE USER
const updateUser = async (req, res) => {
    const { email, firstName, lastName } = req.body;
    if (!email || !firstName || !lastName) {
      throw new BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ _id: req.user.userId });
  
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
  
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

export { showCurrentUser, updateUser, updateUserPassword }