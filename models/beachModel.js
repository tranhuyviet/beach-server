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
});

const Beach = model('Beach', beachSchema);

export default Beach;
