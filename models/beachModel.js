import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const beachSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    lon: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        required: true,
    },
    forDogs: {
        type: Boolean,
        default: false,
    },
    winterSwimming: {
        type: Boolean,
        default: false,
    },
    shower: {
        type: Boolean,
        default: false,
    },
    toilet: {
        type: Boolean,
        default: false,
    },
    restaurant: {
        type: Boolean,
        default: false,
    },
    children: {
        type: Boolean,
        default: false,
    },
    changing: {
        type: Boolean,
        default: false,
    },
    guard: {
        type: Boolean,
        default: false,
    },
    reviews: [
        {
            name: {
                type: String,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
            },
            createdAt: {
                type: String,
                required: true,
            },
        },
    ],
});

const Beach = model('Beach', beachSchema);

export default Beach;
