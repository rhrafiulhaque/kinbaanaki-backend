const { ObjectId } = require("mongodb");
const ApiError = require("../../error/ApiError");
const Product = require("./productModel");
const { calculatePagination } = require("../../app/shared/helper");

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
        availableQuantity: product.availableQuantity,

    } : {
        productName: product.productName,
        price: product.price,
        brand: product.brand,
        category: product.category,
        imageUrl: product.imageUrl,
        description: product.description,
        size: product.sizes,
        availableQuantity: product.availableQuantity,
    }


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
const updateAvailabeQuantity = async (updateProduct) => {

    try {
        const product = await Product.findById(updateProduct.id);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        product.availableQuantity = product.availableQuantity - updateProduct.quantity;
        await product.save();

        return product;
    } catch (err) {
        throw new ApiError(400, "Failed to update product availableQuantity: " + err.message);
    }
}
const getProduct = async (paginationOptions) => {

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const allProduct = await Product.find().sort(sortConditions).skip(skip).limit(limit)
    const total = await Product.countDocuments();
    if (allProduct.length === 0) {

        throw new ApiError(400, "There have no products")
    }
    return {
        meta: {
            page,
            limit,
            total,
        },
        allProduct
    };

}
const getProductById = async (productId) => {
    const product = await Product.findById(productId)
    if (product.length === 0 || product.length === null) {

        throw new ApiError(400, "There have no products")
    }
    return product;

}
const deleteProductById = async (productId) => {

    const data = await Product.findByIdAndDelete(productId);
    return data;

}



const getSearchedProduct = async ({ searchKeyword, categoryFilter, brandFilter }) => {
    const searchCriteria = {};

    if (searchKeyword) {
        searchCriteria.$or = [
            { productName: { $regex: searchKeyword, $options: 'i' } },
            { category: { $regex: searchKeyword, $options: 'i' } },
        ];
    }

    if (categoryFilter && categoryFilter.length > 0) {
        searchCriteria.category = { $in: categoryFilter.map(category => new RegExp(category, 'i')) };
    }

    if (brandFilter && brandFilter.length > 0) {
        searchCriteria.brand = { $in: brandFilter.map(brand => new RegExp(brand, 'i')) };
    }

    try {


        const products = await Product.find(searchCriteria);

        if (products.length === 0) {
            throw new ApiError(400, "There are no products matching the search criteria.");
        }

        return products;
    } catch (err) {
        throw new ApiError(400, "There was a problem retrieving products: " + err.message);
    }
};
const getRelatedProducts = async (category) => {
    const normalizedCategory = category.toLowerCase();

    try {
        const caseInsensitiveCategory = new RegExp(normalizedCategory, 'i');
        const products = await Product.find({ category: caseInsensitiveCategory });



        if (products.length === 0) {
            throw new ApiError(400, "There are no products matching the search criteria");
        }

        return products;
    } catch (err) {
        throw new ApiError(400, "There was a problem retrieving products: " + err.message);
    }
};


const updateProductSales = async (productId, quantity) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        product.sales += quantity;
        await product.save();

        return product;
    } catch (err) {
        throw new ApiError(400, "Failed to update product sales: " + err.message);
    }
};


const getTopSellingProducts = async () => {
    try {
        const topSellingProducts = await Product.find().sort({ sales: -1 }).limit(12);
        return topSellingProducts;
    } catch (err) {
        throw new ApiError(400, "Failed to get top-selling products: " + err.message);
    }
};


module.exports = {
    addProduct,
    getProduct,
    getSearchedProduct,
    getProductById,
    deleteProductById,
    updateProduct,
    updateProductSales,
    getTopSellingProducts,
    updateAvailabeQuantity,
    getRelatedProducts
}
