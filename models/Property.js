import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const PropertySchema = new mongoose.Schema({
    coverPhoto: { type: String, required: true },
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
        minLength: 3,
        maxLength: 20,
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name'],
        minLength: 3,
        maxLength: 20,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 6,
        Select: false
    },
    verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  }
});

export default mongoose.model('Property', PropertySchema)