const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
const authUtils = require('../../util/auth');

const transporter = nodemailer.createTransport(authUtils.googleTransporter);

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: authUtils.extractErrorMessage(req)
    });
};

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
};