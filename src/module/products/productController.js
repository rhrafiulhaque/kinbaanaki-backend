const { pick, paginationFields } = require("../../app/shared/helper")
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

const updateProduct = async (req, res, next) => {
    try {
        const product = req.body
        console.log('prodcut updt', product)
        const result = await productService.updateProduct(product)
        res.status(200).json({
            success: true,
            message: 'Product Updated successfully!',
            data: result,
        })
    } catch (err) {
        next(err)
    }
}


const getProduct = async (req, res, next) => {
    const paginationOptions = pick(req.query, paginationFields)
    try {
        const result = await productService.getProduct(paginationOptions)
        res.status(200).json({
            success: true,
            message: 'Product retrived successfully!',
            meta: result.meta,
            products: result.allProduct,
        })
    } catch (err) {
        next(err)
    }
}
const getTopSellingProducts = async (req, res, next) => {
    try {
        const result = await productService.getTopSellingProducts()
        res.status(200).json({
            success: true,
            message: 'Top Products retrived successfully!',
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
const deleteProductById = async (req, res, next) => {
    const { productId } = req.params
    try {
        const result = await productService.deleteProductById(productId)
        res.status(200).json({
            success: true,
            message: 'Product Deleted successfully!',
            product: result,
        })
    } catch (err) {
        next(err)
    }
}
// const searchProduct = async (req, res, next) => {
//     const { searchedKeyword } = req.params;

//     try {
//         const result = await productService.getSearchedProduct(searchedKeyword)

//         res.status(200).json({
//             success: true,
//             message: 'Serched Product Retrive Successfully!',
//             data: result,
//         })
//     } catch (err) {
//         next(err)
//     }
// }


const searchProduct = async (req, res, next) => {

    const { searchKeyword, category, brand } = req.query;

    try {
        const result = await productService.getSearchedProduct({
            searchKeyword: searchKeyword,
            categoryFilter: category ? category.split(',') : [],
            brandFilter: brand ? brand.split(',') : [],
        });

        res.status(200).json({
            success: true,
            message: 'Searched Product Retrieve Successfully!',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const getRelatedProducts = async (req, res, next) => {

    const { category } = req.query;

    try {
        const result = await productService.getRelatedProducts(category);

        res.status(200).json({
            success: true,
            message: 'Related Products Retrieve Successfully!',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    addProduct,
    getProduct,
    searchProduct,
    getProductById,
    deleteProductById,
    updateProduct,
    getTopSellingProducts,
    getRelatedProducts,
}
