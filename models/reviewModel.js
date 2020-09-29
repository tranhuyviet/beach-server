import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
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
    beachName: {
        type: String,
        required: true,
    },
});

const Review = model('Review', reviewSchema);

export default Review;
