const express = require('express');
const orderController = require('./orderController');
const { auth } = require('../../app/middlewares/auth');

const router = express.Router();
router.post('/addorder', auth('User'), orderController.addOrder);
router.get('/getorderlist/:email', orderController.getOrderList);
router.get('/getorderdetails/', orderController.getOrderDetails);
router.post('/payment/success/:tranId', orderController.successPayment);
module.exports = router


