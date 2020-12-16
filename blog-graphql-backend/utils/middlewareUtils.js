const jwt = require('jsonwebtoken');
const errorUtils = require('./errorUtils');

const corsHeadersMiddelware = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};

const handleErrorMiddelware = (error, req, res, next) => {
    console.log('error handling middleware: ', error);

    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({ message: message });
};

const isAuthMiddelware = (req, res, next) => {
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
        errorUtils.throwError('Not authenticated', 401);
    }

    req.userId = decodedToken.userId;
    next();
}


exports.corsHeadersMiddelware = corsHeadersMiddelware;
exports.handleErrorMiddelware = handleErrorMiddelware;
exports.isAuthMiddelware = isAuthMiddelware;