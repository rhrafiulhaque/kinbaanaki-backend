const Category = require("./categroyModel");

const getCategory = async (req, res, next) => {
    try {

        const data = await Category.find();
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Category List Found',
            data
        });
    } catch (err) {
        next(err)
    }
}

const addCategory = async (req, res, next) => {
    try {
        const category = req.body
        const result = Category.create(category)
        if (!result) {
            res.status(400).json({
                success: false,
                message: 'Category doesnot added !'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Product added successfully!',
            data: result,
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getCategory,
    addCategory
}