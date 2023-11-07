const Brand = require("./brandModel");

const getBrand = async (req, res, next) => {
    try {

        const data = await Brand.find();
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Brand List Found',
            data
        });
    } catch (err) {
        next(err)
    }
}
const deleteBrand = async (req, res, next) => {
    try {
        const id = req.params.id
        const data = await Brand.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Brand Deleted',
            data
        });
    } catch (err) {
        next(err)
    }
}

const addBrand = async (req, res, next) => {
    try {
        const brand = req.body

        brand.brand = brand.brand.toLowerCase();

        const result = await Brand.create(brand);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: 'Brand not added!'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Brand added successfully!',
            data: result,
        })

    } catch (err) {
        // Check if the error is due to a duplicate key violation
        if (err.code === 11000 && err.keyPattern && err.keyValue) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate brand! This brand already exists.',
            })
        }
        next(err)
    }
}


module.exports = {
    getBrand,
    addBrand,
    deleteBrand
}