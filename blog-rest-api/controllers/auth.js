import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'express-validator'
import { User } from '../models/user.js';
import { handleError, throwError } from '../utils/errorUtils.js';

const { check, validationResult } = validator;

export const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throwError('Validation failed', 422);
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
                userId: savedUser._id
            });
    } catch (err) {
        handleError(err, next);
    }
};

export const login = async (req, res, next) => {
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throwError('User with this email not found', 401);
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throwError('Wrong password', 401);
        }

        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        }, 'secret', {
            expiresIn: '1h'
        });

        res.status(200).json({
            token: token,
            userId: user._id.toString()
        });
    } catch (err) {
        handleError(err, next);
    }
};

export const getUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            throwError('User not found', 404);
        }

        res.status(200).json({ status: user.status });
    } catch (err) {
        handleError(err, next);
    }
};

export const updateUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            hrowError('User not found', 404);
        }
        user.status = req.body.status;
        await user.save();

        res.status(200).json({ message: 'Status updated' });
    } catch (err) {
        handleError(err, next);
    }
};

