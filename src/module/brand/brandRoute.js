const express = require('express');
const brandController = require('./brandController');
const { auth } = require('../../app/middlewares/auth');


const router = express.Router();
router.post('/admin/addbrand', auth('Admin'), brandController.addBrand);
router.get('/', brandController.getBrand)
router.delete('/:id', brandController.deleteBrand)

module.exports = router


