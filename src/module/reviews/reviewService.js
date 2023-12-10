const ApiError = require('../../error/ApiError');
const Review = require('./reviewModel');
const mongoose = require("mongoose");

const addReview = async (reviewData) => {
    try {
        const review = new Review(reviewData);
        await review.save();
        await Review.calculateAverageRating(reviewData.product); // Trigger calculation
        return review;
    } catch (error) {
        throw new Error('Failed to add review: ' + error.message);
    }
};

const getReviewsByProduct = async (productId) => {
    try {
        const reviews = await Review.find({ product: new mongoose.Types.ObjectId(productId) }).populate('user', 'email');
        console.log(`reviewServices`, reviews);
        // return reviews;
    } catch (error) {
        throw new Error('Failed to get reviews: ' + error.message);
    }
};

const getReviewsByUserId = async (userId, userEmail) => {
    try {
        const reviews = await Review.find({ userId, userEmail }).populate('product', 'productName');
        return reviews;
    } catch (error) {
        throw new Error('Failed to get reviews: ' + error.message);
    }
};
const getAllReviews = async () => {
    try {
        const reviews = await Review.find();
        return reviews;
    } catch (error) {
        throw new Error('Failed to get reviews: ' + error.message);
    }
};
const deleteReviewsByUserId = async (userId, userEmail, revId) => {
    try {
        const review = await Review.findOne({ userId, userEmail, _id: revId });

        if (!review) {
            throw new Error('Review not found');
        }
        await Review.deleteOne({ _id: new mongoose.Types.ObjectId(revId) });

        return review;
    } catch (error) {
        throw new Error('Failed to delete review: ' + error.message);
    }
};
const getReviewByUserIdAndReviewId = async (userId, userEmail, revId) => {
    try {
        const review = await Review.findOne({ userId, userEmail, _id: revId });

        if (!review) {
            throw new Error('Review not found');
        }

        return review;
    } catch (error) {
        throw new Error('Failed to delete review: ' + error.message);
    }
};

const updateReview = async (userId, userEmail, revId, rating, reviewText) => {
    try {
        const review = await Review.findOne({ userId, userEmail, _id: revId });
        if (!review) {
            throw new ApiError(404, "Review not found");
        }


        if (rating !== '' && reviewText !== '') {
            review.rating = rating;
            review.reviewText = reviewText;
        } else {
            review.rating = rating
        }
        await review.save();

        return review;
    } catch (err) {
        throw new ApiError(400, "Failed to update review: " + err.message);
    }


}

module.exports = {
    addReview,
    getReviewsByProduct,
    getReviewsByUserId,
    deleteReviewsByUserId,
    getReviewByUserIdAndReviewId,
    updateReview,
    getAllReviews
};
