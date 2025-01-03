const express = require('express');
const productController = require('./productController');
const { auth } = require('../../app/middlewares/auth');


const router = express.Router();
router.post('/addproduct', auth('Admin'), productController.addProduct);
router.patch('/updateproduct', auth('Admin'), productController.updateProduct);
router.get('/', productController.getProduct)
router.get('/gettopproductsold', productController.getTopSellingProducts)
router.get('/search/', productController.searchProduct)
router.get('/relatedproducts/', productController.getRelatedProducts)
router.get('/:productId', productController.getProductById)
router.delete('/:productId', productController.deleteProductById)

module.exports = router


