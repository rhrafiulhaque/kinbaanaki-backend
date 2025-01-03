const express = require('express');
const categoryController = require('./categoryController');
const { auth } = require('../../app/middlewares/auth');


const router = express.Router();
router.post('/admin/addcategory', auth('Admin'), categoryController.addCategory);
router.get('/', categoryController.getCategory)
router.delete('/:id', categoryController.deleteCategory)

module.exports = router


