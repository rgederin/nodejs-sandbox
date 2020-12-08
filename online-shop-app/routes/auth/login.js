const express = require('express');
const { check, body } = require('express-validator/check');

const loginController = require('../../controllers/auth/login');
const router = express.Router();

router.get('/login',
    loginController.getLogin);

router.post('/login',
    [body('email')
        .isEmail()
        .withMessage('Please type valid email!')
        .normalizeEmail()
        .trim(),

    body('password', 'Password should be at least 5 characters and alphanumeric')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .normalizeEmail()
    ], loginController.postLogin);

module.exports = router;