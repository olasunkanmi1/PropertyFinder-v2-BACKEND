import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const PropertySchema = new mongoose.Schema({
    coverPhoto: { type: String, required: true },
    price: { type: String, required: true },
    rooms: { type: String, required: true },
    title: { type: String, required: true },
    baths: { type: String, required: true },
    area: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
    rentFrequency: { type: String, required: true },
    agency: { type: String, required: true },
    externalID: { type: String, required: true },
});

export default mongoose.model('Property', PropertySchema)