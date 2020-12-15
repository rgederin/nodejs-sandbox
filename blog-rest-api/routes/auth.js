const express = require('express');
const { body } = require('express-validator/check');
const User = require('../models/user');
const authController = require('../controllers/auth');
const router = express.Router();
const middlewareUtils = require('../utils/middlewareUtils');

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDocument => {
                    if (userDocument) {
                        return Promise.reject('E-Mail address already exists');
                    }
                })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('name')
        .trim()
        .notEmpty()
], authController.signup);

router.post('/login', authController.login);

router.get('/status', middlewareUtils.isAuthMiddelware, authController.getUserStatus);

router.patch('/status', middlewareUtils.isAuthMiddelware, authController.updateUserStatus);

module.exports = router;