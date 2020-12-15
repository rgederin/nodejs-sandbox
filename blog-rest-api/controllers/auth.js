const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorUtils = require('../utils/errorUtils');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errorUtils.throwError('Validation failed', 422);
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name
            });

            return user.save();
        })
        .then(result => {
            res.status(201)
                .json({
                    message: 'User created!',
                    userId: result._id
                });
        })
        .catch(err => {
            errorUtils.handleError(err, next);
        });
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                errorUtils.throwError('User with this email not found', 401);
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                errorUtils.throwError('Wrong password', 401);
            }

            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'secret', {
                expiresIn: '1h'
            });

            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString()
            });
        })
        .catch(err => {
            errorUtils.handleError(err, next);
        });
};

exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                errorUtils.throwError('User not found', 404);
            }

            res.status(200).json({ status: user.status });
        })
        .catch(err => {
            errorUtils.handleError(err, next);
        });
}

exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status;

    User.findById(req.userId)
        .then(user => {
            if (!user) {
                errorUtils.throwError('User not found', 404);
            }

            user.status = newStatus;
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Status updated' });
        })
        .catch(err => {
            errorUtils.handleError(err, next);
        });
}

