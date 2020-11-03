const path = require('path');
const express = require('express');

const adminExports = require('./admin');
const router = express.Router();

router.get('/', (req, res, next) => {
    const products = adminExports.products;
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
});

module.exports = router;


