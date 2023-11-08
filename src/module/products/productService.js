const { ObjectId } = require("mongodb");
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
const updateProduct = async (product) => {

    const updateFields = product.imageUrl === '' ? {
        productName: product.productName,
        price: product.price,
        brand: product.brand,
        category: product.category,
        description: product.description,
        sizes: product.sizes,

    } : {
        productName: product.productName,
        price: product.price,
        brand: product.brand,
        category: product.category,
        imageUrl: product.imageUrl,
        description: product.description,
        size: product.sizes,
    }

    console.log('updateFields', updateFields)

    const data = await Product.findOneAndUpdate(
        { _id: new ObjectId(product.id) },
        { $set: updateFields },
        { upsert: true }
    );

    if (!data) {
        // alter by Api Error
        res.status(400).json({
            success: false,
            message: 'Product doesnot updated successfully!'
        })
    }
    return data;

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
const deleteProductById = async (productId) => {

    const data = await Product.findByIdAndDelete(productId);
    return data;

}
const getSearchedProduct = async (searchedKeyword) => {
    const searchCriteria = {
        $or: [
            { productName: { $regex: searchedKeyword, $options: 'i' } }, // Case-insensitive regex match on product name
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
    getProductById,
    deleteProductById,
    updateProduct
}
