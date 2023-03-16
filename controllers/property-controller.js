import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'
import { createTokenUser, attachCookiesToResponse, } from '../utils/index.js';

// SAVE PROPERTY
const saveProperty = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: 'save property' });
};

// GET SAVED PROPERTIES
const getSavedProperties = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: 'get saved properties' });
};

export { saveProperty, getSavedProperties }