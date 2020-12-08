const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const authUtils = require('../../util/auth');
const { validationResult } = require('express-validator/check');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: authUtils.extractErrorMessage(req),
        oldInput: { email: '', password: '' },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: errors.array()[0].msg,
                oldInput: { email: email, password: password },
                validationErrors: errors.array()
            });
    }


    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422)
                    .render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'User with such email des not exists',
                        oldInput: { email: email, password: password },
                        validationErrors: []
                    });
            }

            bcrypt.compare(password, user.password)
                .then(result => {
                    if (result) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(() => {
                            return res.redirect('/');
                        })
                    }
                    // req.flash('error', 'Invalid password');
                    return res.status(422)
                        .render('auth/login', {
                            path: '/login',
                            pageTitle: 'Login',
                            errorMessage: 'Invalid password for this user',
                            oldInput: { email: email, password: password },
                            validationErrors: []
                        });
                })
                .catch(err => {
                    res.redirect('/login');
                });
        });
};