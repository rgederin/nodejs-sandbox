const path = require('path');
const express = require('express');

const router = express.Router();
const products = [];

// /admin/add-product => GET
// Render EJS template with the form for adding new product to the shop
router.get('/add-product', (req, res, next) => {
    console.log('add product route')
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    // save product in inmemory array
    products.push({ productTitle: req.body.title });
    res.redirect('/');
});

exports.routes = router;
exports.products = products;