const path = require('path');
const express = require('express');

const productsController = require('../controllers/products');
const router = express.Router();

// /admin/add-product => GET
// Render EJS template with the form for adding new product to the shop
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

module.exports = router;
