import User from '../models/User.js'
import Property from '../models/Property.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError, ConflictError } from '../errors/index.js'
import { createTokenUser, sendVerificationEmail, sendResetPasswordEmail, createHash, 
  attachCookiesToResponse, generateCode
} from '../utils/index.js';
import crypto from 'crypto'
import { userObj } from '../middleware/authentication.js';

const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName || !email || !password) {
        throw new BadRequestError('please provide all values');
    }

    const  userAlreadyExists = await User.findOne({ email });
    if(userAlreadyExists) {
        throw new ConflictError('Email already exist');
    }

    const verificationCode = generateCode();
    
    const user = await User.create({ firstName, lastName, email, password, verificationCode });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res, user: tokenUser});

    await sendVerificationEmail({
        name: user.firstName,
        email: user.email,
        verificationCode: user.verificationCode
    })

    const obj = userObj(user)

    res.status(StatusCodes.CREATED).json({user: obj, msg: 'Account created successfully'})
}

const verifyEmail = async (req, res) => {
    const { verificationCode, fromDropdown } = req.body;
    let msg;

    const user = await User.findOne({  _id: req.user.userId });
    
    if(fromDropdown) {
      user.verificationCode = generateCode();
      await user.save();

        await sendVerificationEmail({
            name: user.firstName,
            email: user.email,
            verificationCode: user.verificationCode
        })

        msg = 'Please check your email to verify'
    } else {
      if (!user) {
        throw new UnAuthenticatedError('Verification Failed');
      }
  
      if (user.verificationCode !== verificationCode) {
        throw new BadRequestError('Invalid code');
      }
      
      user.isVerified = true
      user.verified = Date.now();
      user.verificationCode = '';
      
      await user.save();
      msg = 'Email verified successfully'
    }
  
    res.status(StatusCodes.OK).json({ msg });
};

const login = async (req, res) => {
    const { email, password, ptyToSaveOnLogin } = req.body;

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
    
    const savedProperties =  await Property.find({ user: user._id });
    const savedPropertiesIDs = savedProperties.map((pty) => pty.externalID);
    const alreadySaved = ptyToSaveOnLogin ? savedPropertiesIDs.includes(ptyToSaveOnLogin.externalID) : undefined;
    if(ptyToSaveOnLogin && !alreadySaved) {
      ptyToSaveOnLogin.user = user._id;
      const newProperty = await Property.create(ptyToSaveOnLogin);
      savedProperties.push(newProperty); // Add the new property to the savedProperties array
    }

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    const obj = userObj(user);

    res.status(StatusCodes.OK).json({user: obj, savedProperties, alreadySaved, msg: 'Logged in successfully'})
}

const logout = async (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError('Please provide valid email');
    }
  
    const user = await User.findOne({ email });
  
    if (user) {
      const passwordToken = crypto.randomBytes(70).toString('hex');
      
      // send email
      await sendResetPasswordEmail({
        name: user.firstName,
        email: user.email,
        passwordToken: passwordToken
        })
  
      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
  
      user.passwordToken = createHash(passwordToken);
      user.passwordTokenExpirationDate = passwordTokenExpirationDate;
      await user.save();
    }
  
    // still send success if no user with that email. so as not to allow intruder know which email are in db
    res
      .status(StatusCodes.OK)
      .json({ msg: 'Please check your email for reset password link' });
};

const resetPassword = async (req, res) => {
    const { passwordToken, email, password } = req.body;

    if (!passwordToken || !email || !password) {
      throw new BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ email });
  
    if (user) {
      const currentDate = new Date();
  
      if (
        user.passwordToken === createHash(passwordToken) &&
        user.passwordTokenExpirationDate > currentDate
      ) {
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();
      }
    }
  
    // still send success if no user with that email. so as not to allow intruder know which email are in db
    res.status(StatusCodes.OK).json({ msg: 'Password reset successfully' });
};

export { register, verifyEmail, login, logout, forgotPassword, resetPassword }