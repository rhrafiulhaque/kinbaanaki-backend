const productService = require("./productService")

const addProduct = async (req, res, next) => {
    try {
        const product = req.body
        const result = await productService.addProduct(product)
        res.status(200).json({
            success: true,
            message: 'Product added successfully!',
            data: result,
        })
    } catch (err) {
        next(err)
    }
}
const getProduct = async (req, res, next) => {
    try {
        const result = await productService.getProduct()
        res.status(200).json({
            success: true,
            message: 'Product retrived successfully!',
            products: result,
        })
    } catch (err) {
        next(err)
    }
}
const getProductById = async (req, res, next) => {
    const { productId } = req.params
    try {
        const result = await productService.getProductById(productId)
        res.status(200).json({
            success: true,
            message: 'Product retrived successfully!',
            product: result,
        })
    } catch (err) {
        next(err)
    }
}
const searchProduct = async (req, res, next) => {
    const { searchedKeyword } = req.params;

    try {
        const result = await productService.getSearchedProduct(searchedKeyword)
        res.status(200).json({
            success: true,
            message: 'Products retrived successfully!',
            data: result,
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    addProduct,
    getProduct,
    searchProduct,
    getProductById
}
