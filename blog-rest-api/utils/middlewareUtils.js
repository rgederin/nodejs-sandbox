import jwt from 'jsonwebtoken';
import { throwError } from './errorUtils.js';

export const corsHeadersMiddelware = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};

export const handleErrorMiddelware = (error, req, res, next) => {
    console.log('error handling middleware: ', error);

    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({ message: message });
};

export const isAuthMiddelware = (req, res, next) => {
    const token = req.get('Authorization')
        .split(' ')[1];

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        err.status = 500;
        throw err;
    }

    if (!decodedToken) {
        throwError('Not authenticated', 401);
    }

    req.userId = decodedToken.userId;
    next();
}