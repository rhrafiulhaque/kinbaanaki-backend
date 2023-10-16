const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    product_name: {
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
    color: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    imgThree: String,
    availibility: {
        type: Boolean,
        required: true,
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