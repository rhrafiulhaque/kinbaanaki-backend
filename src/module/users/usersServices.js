const config = require("../../config");
const ApiError = require("../../error/ApiError");
const User = require("./usersModel");
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const addUser = async (user) => {
    user.password = await bcrypt.hash(user.password, 10)
    const createUser = await User.create(user)
    if (!createUser) {
        throw new ApiError(501, 'User Doesnot Added!!')
    }
    const { password, ...userWithoutPassword } = createUser.toObject()

    const accessToken = generateAccessToken(
        userWithoutPassword._id.toString(),
        userWithoutPassword.role,
        userWithoutPassword.email,
        userWithoutPassword.name
    )
    return { accessToken, userWithoutPassword }

}

const emailVerification = async () => {
    const generateVerificationToken = crypto.randomBytes(20).toString('hex')
}

const loginUser = async (email, password) => {
    const userExist = await User.findOne({ email });
    if (!userExist) {
        throw new ApiError(404, 'User not found');
    }

    const passwordMatched = await bcrypt.compare(password, userExist.password);
    if (!passwordMatched) {
        throw new ApiError(401, 'Invalid password');
    }

    const accessToken = generateAccessToken(
        userExist._id.toString(),
        userExist.role,
        userExist.email,
        userExist.name
    )
    return accessToken;

}


const generateAccessToken = (userId, role, email, name) => {
    const token = jwt.sign({ userId, role, email, name }, config.jwt.jwt_secret, {
        expiresIn: config.jwt.jwt_expires,
    })
    return token
}


const getUser = async (useremail) => {

    const user = await User.findOne({ email: useremail.email });
    return user
}
const getAllUser = async () => {

    const users = await User.find();
    return users
}
const getAdmin = async (useremail) => {

    const user = await User.findOne({ email: useremail.email });
    return user
}

const updateUser = async (user) => {
    const updateFields = {
        phonenumber: user.phonenumber,
        birthDate: user.birthdate,
        gender: user.gender
    };
    const result = await User.findOneAndUpdate(
        { email: user.email },
        { $set: updateFields },
        { new: true, upsert: true }
    );

    return result
}
const updateUserAddress = async (user) => {
    const updateFields = {
        city: user.city,
        district: user.district,
        address: user.address
    };
    const result = await User.findOneAndUpdate(
        { email: user.email },
        { $set: updateFields },
        { new: true, upsert: true }
    );

    return result
}



module.exports = {
    addUser,
    loginUser,
    getUser,
    updateUser,
    updateUserAddress,
    getAdmin,
    getAllUser
}
