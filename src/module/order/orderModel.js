const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    products: {
        type: Array,
    },
    paidStatus: {
        type: Boolean,
    },
    tranjectionId: {
        type: String
    },
    email: {
        type: String
    }


},
    {
        timestamps: true,
    }

)

const Order = new mongoose.model("Orders", orderSchema)

module.exports = Order