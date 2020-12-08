const express = require('express');
const { check, body } = require('express-validator/check');

const signupController = require('../../controllers/auth/signup');
const User = require('../../models/user');

const router = express.Router();

router.get('/signup', signupController.getSignup);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please add valid email!')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'E-Mail exists already, please pick a different one.'
                        );
                    }
                });
            })
            .normalizeEmail(),

        body('password', 'Password should be at least 5 characters and alphanumeric')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),

        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match');
                }
                return true;
            })
            .trim()
    ], signupController.postSignup);


module.exports = router;