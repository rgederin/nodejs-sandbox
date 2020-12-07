const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const e = require('express');
const { use } = require('../routes/auth');
const user = require('../models/user');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gederin.ruslan@gmail.com',
        pass: '452629996'
    }
});

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email');
                return res.redirect('/login');
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
                    req.flash('error', 'Invalid password');
                    res.redirect('/login');
                })
                .catch(err => {
                    res.redirect('/login');
                });
        });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                //such user already exists
                req.flash('error', 'This e-mail already exists');

                return res.redirect('/signup');
            }

            return bcrypt.hash(password, 12)
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
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: message
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }

        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with this email found!');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'gederin.ruslan@gmail.com',
                    subject: 'Password reset',
                    html: `
                        <p>You request a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to setup new password</p>
                    `
                });
            });
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({ resetToken: token })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }

            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'Reset password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });

        })
        .catch(err => {
            console.log(err);
        });
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/');
        });


}