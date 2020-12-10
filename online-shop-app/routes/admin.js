const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { check, body } = require('express-validator/check');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);


router.post('/add-product', isAuth, [
    check('title', 'Title of the product should not be empty')
        .notEmpty()
        .trim(),
    // body('imageUrl', 'Image URL should not be empty and should be URL')
    //     .notEmpty()
    //     // .isURL()
    //     .trim(),
    body('price', 'Product price should not be empty')
        .notEmpty()
        .trim()
],
    adminController.postAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
