const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator/check');
const authUtils = require('../../util/auth');

const transporter = nodemailer.createTransport(authUtils.googleTransporter);

//Render signup page
exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: authUtils.extractErrorMessage(req),
        oldInput: { email: '', password: '', confirmPassword: '' },
        validationErrors: []
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422)
            .render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                errorMessage: errors.array()[0].msg,
                oldInput: { email: email, password: password, confirmPassword: req.body.confirmPassword },
                validationErrors: errors.array()
            });
    }

    bcrypt.hash(password, 12)
        .then(hash => {
            const newUser = new User({
                email: email,
                password: hash,
                cart: { items: [] }
            });

            return newUser.save();
        })
        .then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'gederin.ruslan@gmail.com',
                subject: 'Signup succeeded!',
                html: '<h1>You are successfully signed up</h1>'
            });
        })
        .catch(err => {
            console.log(err);
        });
};