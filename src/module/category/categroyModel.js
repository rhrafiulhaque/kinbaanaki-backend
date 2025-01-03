const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    category: {
        type: String,
        unique: true,
        required: true,
        collation: { locale: 'en', strength: 2 }
    },
    catImg: {
        type: String,
        required: true
    }


},
    {
        timestamps: true,
    }

)

const Category = new mongoose.model("Categories", categorySchema)

module.exports = Category