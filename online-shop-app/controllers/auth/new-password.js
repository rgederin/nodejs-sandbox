const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const authUtils = require('../../util/auth');

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({ resetToken: token })
        .then(user => {
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'Reset password',
                errorMessage: authUtils.extractErrorMessage(req),
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