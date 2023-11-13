const mongoose = require("mongoose");
const Product = require("../products/productModel");

const reviewSchema = mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    reviewText: {
        type: String,
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,

    },
},
    {
        timestamps: true,
    }

)

reviewSchema.statics.calculateAverageRating = async function (productId) {
    try {
        const stats = await this.aggregate([
            {
                $match: { product: new mongoose.Types.ObjectId(productId._id) },
            },
            {
                $group: {
                    _id: '$product',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$rating' },
                },
            },
        ]);
        console.log('Product ID:', productId._id);
        console.log('Stats:', stats);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId._id, {
                averageRating: stats[0].avgRating,
                ratingsQuantity: stats[0].nRating,
            });
        } else {
            await Product.findByIdAndUpdate(productId._id, {
                averageRating: 0,
                ratingsQuantity: 0,
            });
        }
    } catch (error) {
        console.error('Error calculating average rating:', error.message);
    }
};



const Review = new mongoose.model("Review", reviewSchema)


module.exports = Review;


