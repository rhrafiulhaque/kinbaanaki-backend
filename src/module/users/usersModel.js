const mongoose = require("mongoose")

const usersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'User']
    },
    birthDate: {
        type: Date,

    },
    gender: {
        type: String
    },
    phonenumber: {
        type: Number
    },
    address: {
        type: String,

    },
    district: {
        type: String
    },

    city: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true,
    }

)


const User = new mongoose.model("Users", usersSchema)

module.exports = User