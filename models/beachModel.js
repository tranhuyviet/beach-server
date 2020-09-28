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
});

const Beach = model('Beach', beachSchema);

export default Beach;
