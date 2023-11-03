const ApiError = require("../../error/ApiError");
const Product = require("./productModel")

const addProduct = async (product) => {

    const createProduct = Product.create(product)
    if (!createProduct) {
        // alter by Api Error
        res.status(400).json({
            success: false,
            message: 'Product doesnot added successfully!'
        })
    }
    return createProduct;

}
const getProduct = async () => {

    const allProduct = await Product.find()
    if (allProduct.length === 0) {

        throw new ApiError(400, "There have no products")
    }
    return allProduct;

}
const getProductById = async (productId) => {

    const product = await Product.findById(productId)
    if (product.length === 0) {

        throw new ApiError(400, "There have no products")
    }
    return product;

}
const getSearchedProduct = async (searchedKeyword) => {
    const searchCriteria = {
        $or: [
            { name: { $regex: searchedKeyword, $options: 'i' } }, // Case-insensitive regex match on product name
            { category: { $regex: searchedKeyword, $options: 'i' } },
        ],
    };

    try {
        const products = await Product.find(searchCriteria);

        if (products.length === 0) {
            throw new ApiError(400, "There are no products matching the search criteria");
        }
        return products;
    } catch (err) {
        throw new ApiError(400, "There was a problem retrieving products: " + err.message);
    }
};


module.exports = {
    addProduct,
    getProduct,
    getSearchedProduct,
    getProductById
}
