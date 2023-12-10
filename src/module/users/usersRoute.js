const express = require('express');
const usersController = require('./usersController');
const { auth } = require('../../app/middlewares/auth');



const router = express.Router();
router.post('/create-user', usersController.signUpUser);
router.post('/login-user', usersController.loginUser);
router.get('/get-user/:email', auth('User'), usersController.getUser);
router.get('/admin/getalluser/', auth('Admin'), usersController.getAllUser);
router.get('/admin/:email', auth('Admin'), usersController.getAdmin);
router.get('/verifyemail', usersController.verifyEmail);
router.patch('/update-user', auth('User'), usersController.updateUser);
router.patch('/update-user-address', auth('User'), usersController.updateUserAddress);


module.exports = router


