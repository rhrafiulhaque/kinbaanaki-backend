const express = require('express');
const productController = require('./productController')


const router = express.Router();
router.post('/addproduct', productController.addProduct);
router.get('/', productController.getProduct)
router.get('/search/:searchedKeyword', productController.searchProduct)
router.get('/:productId', productController.getProductById)

module.exports = router


