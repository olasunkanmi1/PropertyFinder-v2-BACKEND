import Property from '../models/Property.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'
import { createTokenUser, attachCookiesToResponse, } from '../utils/index.js';

// SAVE PROPERTY
const saveProperty = async (req, res) => {
    req.body.user = req.user.userId
    const property = await Property.create(req.body)
    res.status(StatusCodes.CREATED).json({ property });
};

// GET SAVED PROPERTIES
const getSavedProperties = async (req, res) => {
    const savedProperties =  await Property.find({ user: req.user.userId })
    res.status(StatusCodes.OK).json({ savedProperties });
};

export { saveProperty, getSavedProperties }