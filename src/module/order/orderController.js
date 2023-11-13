const SSLCommerzPayment = require('sslcommerz-lts')
const Product = require('../products/productModel')
const { ObjectId } = require('mongodb')
const Order = require('./orderModel')
const productService = require('../products/productService');
const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASSWORD
const is_live = false


const addOrder = async (req, res, next) => {


    try {

        const order = req.body
        const email = order.data.email
        const products = order.cartProducts
        const total_price = order.cartProducts.reduce((acc, product) => {
            const subtotal = product.quantity * product.price;
            return acc + subtotal;
        }, 0);

        const tran_id = new ObjectId().toString();


        const data = {
            total_amount: total_price,
            currency: 'BDT',
            tran_id: tran_id, // use unique tran_id for each api call
            success_url: `http://localhost:5000/api/v1/order/payment/success/${tran_id}`,
            // success_url: `https://kinbaanaki-backend.vercel.app/api/v1/order/payment/success/${tran_id}`,
            fail_url: 'http://localhost:3030/fail',
            cancel_url: 'http://localhost:3030/cancel',
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'Courier',
            product_name: 'computer',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: order.data.name,
            cus_email: order.data.email,
            cus_add1: order.data.address,
            cus_add2: order.data.district,
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: order.data.phonenumber,
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
        sslcz.init(data).then(apiResponse => {
            // Redirect the user to payment gateway
            let GatewayPageURL = apiResponse.GatewayPageURL
            res.send({ url: GatewayPageURL })
            console.log('Redirecting to: ', GatewayPageURL)
        });


        for (const product of products) {
            console.log(product)
            await productService.updateProductSales(product._id, product.quantity);

            const updatedProduct = await productService.updateAvailabeQuantity({
                id: product._id,
                quantity: product.quantity,
            });
        }


        const finalOrder = {
            products,
            email,
            paidStatus: false,
            tranjectionId: tran_id,
            deliveryStatus: 'Processing'
        }

        const result = Order.create(finalOrder)

    } catch (err) {
        next(err)
    }
}


const successPayment = async (req, res, next) => {
    try {

        const result = await Order.updateOne({ tranjectionId: req.params.tranId }, { paidStatus: true })

        // Check if the update operation was successful
        if (result.modifiedCount === 1) {
            res.redirect('http://localhost:3000/payment-success')
            // res.redirect('https://kinbaanaki.web.app/payment-success')
        } else {
            console.log('Document not found or not updated');
            // Handle the case where the document was not found or not updated.
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (err) {
        next(err)
    }
}

const getOrderList = async (req, res, next) => {
    try {

        const data = await Order.find({ email: req.params.email });
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Order List Found',
            data
        });
    } catch (err) {
        next(err)
    }
}
const adminGetOrderList = async (req, res, next) => {
    try {

        const data = await Order.find();
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Order List Found',
            data
        });
    } catch (err) {
        next(err)
    }
}

const getOrderDetails = async (req, res, next) => {
    const { email, id } = req.query;
    try {
        const data = await Order.findOne({ email: email } && { _id: new ObjectId(id) });
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Order Details Found',
            data
        });
    } catch (err) {
        next(err)
    }
}
const updateDeliveryStatus = async (req, res, next) => {
    try {

        const updateFields = {
            deliveryStatus: req.body.deliveryStatus
        };
        const data = await Order.findOneAndUpdate(
            { email: req.body.email } && { _id: new ObjectId(req.body.id) },
            { $set: updateFields },
            { upsert: true }
        );

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Order Updated Successfully',
            data
        });
    } catch (err) {
        next(err)
    }
}


const monthlyOrder = async (req, res, next) => {
    try {
        const monthlyOrders = await Order.aggregate([
            {
                $project: {
                    month: { $month: '$createdAt' },
                    year: { $year: '$createdAt' },
                }
            },
            {
                $group: {
                    _id: { month: '$month', year: '$year' },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.json(monthlyOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
const monthlyAddProduct = async (req, res, next) => {
    try {
        const monthlyProductCount = await Product.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    productCount: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.json(monthlyProductCount);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = {
    addOrder,
    successPayment,
    getOrderList,
    getOrderDetails,
    adminGetOrderList,
    updateDeliveryStatus,
    monthlyOrder,
    monthlyAddProduct
}


