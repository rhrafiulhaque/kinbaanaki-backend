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
const deleteCategory = async (req, res, next) => {
    try {
        const id = req.params.id
        const data = await Category.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Category Deleted',
            data
        });
    } catch (err) {
        next(err)
    }
}

const addCategory = async (req, res, next) => {
    try {
        const category = req.body

        category.category = category.category.toLowerCase();

        const result = await Category.create(category);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: 'Category not added!'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Category added successfully!',
            data: result,
        })

    } catch (err) {
        // Check if the error is due to a duplicate key violation
        if (err.code === 11000 && err.keyPattern && err.keyValue) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate category! This category already exists.',
            })
        }
        next(err)
    }
}


module.exports = {
    getCategory,
    addCategory,
    deleteCategory
}