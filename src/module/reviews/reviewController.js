const reviewService = require('./reviewService');
const ApiError = require('../../error/ApiError');
const Product = require('../products/productModel');

const addReview = async (req, res, next) => {
    try {
        const reviewData = req.body;
        const result = await reviewService.addReview(reviewData);
        const product = await Product.findById(reviewData.product);
        res.status(201).json({
            success: true,
            message: 'Review added successfully!',
            data: { review: result, averageRating: product.averageRating },
        });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};

const getReviewsByProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const reviews = await reviewService.getReviewsByProduct(productId);
        res.status(200).json({
            success: true,
            message: 'Reviews retrieved successfully!',
            data: reviews,
        });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};


const getReviewsByUserId = async (req, res, next) => {
    const { userId, userEmail } = req.params;
    try {
        const reviews = await reviewService.getReviewsByUserId(userId, userEmail);
        res.status(200).json({
            success: true,
            message: 'Reviews retrieved successfully!',
            data: reviews,
        });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};
const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await reviewService.getAllReviews();
        res.status(200).json({
            success: true,
            message: 'Reviews retrieved successfully!',
            data: reviews,
        });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};
const deleteReviewsByUserId = async (req, res, next) => {
    const { userId, userEmail, revId } = req.params;
    try {
        const reviews = await reviewService.deleteReviewsByUserId(userId, userEmail, revId);
        res.status(200).json({
            success: true,
            message: 'Reviews deleted successfully!',
            data: reviews,
        });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};
const getReviewByUserIdAndReviewId = async (req, res, next) => {
    const { userId, userEmail, revId } = req.params;
    try {
        const reviews = await reviewService.getReviewByUserIdAndReviewId(userId, userEmail, revId);
        res.status(200).json({
            success: true,
            message: 'Review Retrive successfully!',
            data: reviews,
        });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};
const updateReview = async (req, res, next) => {
    const { userId, userEmail, revId, rating, reviewText } = req.body;
    try {
        const reviews = await reviewService.updateReview(userId, userEmail, revId, rating, reviewText);
        res.status(200).json({
            success: true,
            message: 'Review Retrive successfully!',
            data: reviews,
        });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};

module.exports = {
    addReview,
    getReviewsByProduct,
    getReviewsByUserId,
    deleteReviewsByUserId,
    getReviewByUserIdAndReviewId,
    updateReview,
    getAllReviews
};
