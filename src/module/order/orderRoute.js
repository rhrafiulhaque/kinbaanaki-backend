const express = require('express');
const orderController = require('./orderController');
const { auth } = require('../../app/middlewares/auth');

const router = express.Router();
router.post('/addorder', auth('User'), orderController.addOrder);
router.patch('/updatedeliverystatus', auth('Admin'), orderController.updateDeliveryStatus);
router.get('/getorderlist/:email', orderController.getOrderList);
router.get('/admin/getorderlist/', orderController.adminGetOrderList);
router.get('/getorderdetails/', orderController.getOrderDetails);
router.get('/monthlyorder/', auth('Admin'), orderController.monthlyOrder);
router.get('/monthlyaddproduct/', auth('Admin'), orderController.monthlyAddProduct);
router.post('/payment/success/:tranId', orderController.successPayment);
module.exports = router


