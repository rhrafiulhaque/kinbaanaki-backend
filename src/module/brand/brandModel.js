const mongoose = require("mongoose")

const brandSchema = mongoose.Schema({
    brand: {
        type: String,
        unique: true,
        required: true,
        collation: { locale: 'en', strength: 2 }
    },
    brandImg: {
        type: String,
    }


},
    {
        timestamps: true,
    }

)

const Brand = new mongoose.model("Brands", brandSchema)

module.exports = Brand