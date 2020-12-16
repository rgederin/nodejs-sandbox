const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorUtils = require('../utils/errorUtils');
const { use } = require('../routes/auth');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errorUtils.throwError('Validation failed', 422);
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        });
        const savedUser = await user.save();

        res.status(201)
            .json({
                message: 'User created!',
                userId: result._id
            });
    } catch (err) {
        errorUtils.handleError(err, next);
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    try {
        const user = User.findOne({ email: req.body.email });
        if (!user) {
            errorUtils.throwError('User with this email not found', 401);
        }

        const isEqual = await bcrypt.compare(password, user.password);
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
    } catch (err) {
        errorUtils.handleError(err, next);
    }
};

exports.getUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            errorUtils.throwError('User not found', 404);
        }

        res.status(200).json({ status: user.status });
    } catch (err) {
        errorUtils.handleError(err, next);
    }
};

exports.updateUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            errorUtils.throwError('User not found', 404);
        }
        user.status = req.body.status;
        await user.save();

        res.status(200).json({ message: 'Status updated' });
    } catch (err) {
        errorUtils.handleError(err, next);
    }
};

