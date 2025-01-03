const usersService = require('./usersServices')
const signUpUser = async (req, res, next) => {
    try {
        const user = req.body
        const result = await usersService.addUser(user)
        if (result) {
            res.status(200).json({
                success: true,
                message: 'User added successfully!',
                data: result,
            })
        }

    } catch (err) {
        next(err)
    }
}

const verifyEmail = async (req, res, next) => {

    try {
        const userId = req.query.id
        const result = await usersService.verifyEmail(userId)
        if (result.modifiedCount === 1) {
            res.redirect('http://localhost:3000/verify-email')
            // res.redirect('https://kinbaanaki.web.app/verify-email')
        } else {

            res.status(404).json({ message: 'Verify Email not found' });
        }
    } catch (error) {
        next(error)
    }
}


const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const accessToken = await usersService.loginUser(email, password);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
        });
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'User logged in successfully',
            data: {
                accessToken,
            },
        });
    } catch (err) {
        next(err);
    }
}


const getUser = async (req, res, next) => {
    try {
        const user = await usersService.getUser(req.params);
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'User find successfully',
            user
        });
    } catch (err) {
        next(err);
    }
}
const getAllUser = async (req, res, next) => {
    try {
        const user = await usersService.getAllUser();
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Users find successfully',
            user
        });
    } catch (err) {
        next(err);
    }
}

const getAdmin = async (req, res, next) => {
    try {
        const user = await usersService.getAdmin(req.params);
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Admin find successfully',
            user
        });
    } catch (err) {
        next(err);
    }
}
const updateUser = async (req, res, next) => {
    try {
        const user = await usersService.updateUser(req.body);
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'User updated successfully',
            user
        });
    } catch (err) {
        next(err);
    }
}
const updateUserAddress = async (req, res, next) => {
    try {
        const user = await usersService.updateUserAddress(req.body);
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'User updated successfully',
            user
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    signUpUser,
    loginUser,
    getUser,
    updateUser,
    updateUserAddress,
    getAdmin,
    getAllUser,
    verifyEmail
}
