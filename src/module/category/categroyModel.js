const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    category: {
        type: String,
        required: true
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