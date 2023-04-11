import mongoose from 'mongoose';
import Property from '../models/Property.js'
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/index.js'
import { checkPermissions } from '../utils/index.js';

// SAVE PROPERTY
const saveProperty = async (req, res) => {
    req.body.user = req.user.userId
    const property = await Property.create(req.body)
    res.status(StatusCodes.OK).json({ property });
};

// GET SAVED PROPERTIES
const getSavedProperties = async (req, res) => {
    const savedProperties =  await Property.find({ user: req.user.userId })
    res.status(StatusCodes.OK).json({ savedProperties });
};

// REMOVE SAVED PROPERTY
const unsaveProperty = async (req, res) => {
    const { externalID } = req.params;

    const property = await Property.findOne({ externalID });
    if(!property) {
        throw new NotFoundError(`No property with externalID: ${externalID}`)
    }

    checkPermissions(req.user, property.user)

    await property.deleteOne();
    res.status(StatusCodes.OK).json({ msg: 'Success! Property removed.' });
}

// REMOVE ALL SAVED PROPERTY
const unsaveAllProperties = async (req, res) => {
    const property = mongoose.model('Property');
    
    await property.deleteMany({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ msg: 'Success! All Saved Properties removed.' });
}

export { saveProperty, getSavedProperties, unsaveProperty, unsaveAllProperties }