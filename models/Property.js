import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
    coverPhoto: { 
        url: { type: String, required: true }
    },
    location: [{ 
        name: { type: String, required: true }
    }],
    price: { type: Number, required: true },
    rooms: { type: String, required: true },
    title: { type: String, required: true },
    baths: { type: String, required: true },
    area: { type: Number, required: true },
    isVerified: { type: Boolean, required: true },
    rentFrequency: { type: String },
    agency: { 
        logo: {
            url: { type: String, required: true },
        },
        name: { type: String, required: true },
    },
    externalID: { type: String, required: true },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {timestamps: true});

export default mongoose.model('Property', PropertySchema)