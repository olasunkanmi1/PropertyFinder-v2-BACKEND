import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'
import { createTokenUser, attachCookiesToResponse } from '../utils/index.js';

const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName || !email || !password) {
        throw new BadRequestError('please provide all values');
    }

    const  userAlreadyExists = await User.findOne({ email });
    if(userAlreadyExists) {
        throw new BadRequestError('Email already exist');
    }
    
    const user = await User.create({ firstName, lastName, email, password });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res, user: tokenUser});

    res.status(StatusCodes.CREATED).json({user: tokenUser})
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        throw new BadRequestError('please provide email and password');
    }
    
    const user = await User.findOne({ email }).select('+password');
    if(!user) {
        throw new UnAuthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) {
        throw new UnAuthenticatedError('Invalid Credentials');
    }

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

export { register, login, logout }