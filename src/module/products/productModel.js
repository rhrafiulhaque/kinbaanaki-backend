const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    old_price: Number,
    brand: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    imgThree: {
        type: String
    },
    category: {
        type: String,
        required: true,
    },
    ratings: {
        type: Number,
    },
    size: [{
        type: String,
        required: true,
        enum: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    }],

},
    {
        timestamps: true,
    }

)

const Product = new mongoose.model("Products", productSchema)

module.exports = Product