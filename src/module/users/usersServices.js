const config = require("../../config");
const ApiError = require("../../error/ApiError");
const User = require("./usersModel");
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')


const sendVerifyEmail = async (name, email, id) => {
    console.log(email)
    try {
        const transporter = nodemailer.createTransport({
            // host: "smtp.ethereal.email",
            service: 'gmail',
            port: 587,
            auth: {
                user: 'abuhanjp@gmail.com',
                pass: 'djnz pnli wpro iono'
            }
        })

        let info = await transporter.sendMail({
            from: '"KinbaaNaki" <kinbaanakiadmin@gmail.com>',
            to: email,
            subject: "Verification",
            html: `<p>Hello ${name},please click here to <a href="http://localhost:5000/api/v1/user/verifyemail?id=${id}">Verify</a> your Email`
            // html: `<p>Hello ${name},please click here to <a href="https://kinbaanaki-backend.vercel.app/api/v1/user/verifyemail?id=${id}">Verify</a> your Email`
        })

        console.log(`Message sent, ${info.messageId}`)
        return info;
    } catch (error) {
        console.log(error.message)
    }
}

const addUser = async (user) => {
    user.password = await bcrypt.hash(user.password, 10)
    const userEmail = user.email
    const userExist = await User.findOne({ email: userEmail });
    if (!userExist) {
        const createUser = await User.create(user)
        // console.log(createUser._id)
        if (!createUser) {
            throw new ApiError(501, 'User Doesnot Added!!')
        }

        //mail to go 
        sendVerifyEmail(user.name, user.email, createUser._id)


        const { password, ...userWithoutPassword } = createUser.toObject()
        return userWithoutPassword

    } else {
        throw new ApiError(501, 'Email Already Registered!')
    }

}

const verifyEmail = async (userId) => {
    const updateInfo = await User.updateOne({ _id: userId }, { $set: { isVerified: true } })
    return updateInfo;

}


const loginUser = async (email, password) => {
    const userExist = await User.findOne({ email });
    if (!userExist) {
        throw new ApiError(404, 'User not found');
    }
    if (userExist && userExist.isVerified) {
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
    } else {
        throw new ApiError(501, 'Please Verify your Email. If you not receive any email on your inbox then check the spam');
    }
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

    const user = await User.findOne({ email: useremail.email }).select('-password');
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
    getAllUser,
    verifyEmail
}
