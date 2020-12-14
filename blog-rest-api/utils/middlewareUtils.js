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


exports.corsHeadersMiddelware = corsHeadersMiddelware;
exports.handleErrorMiddelware = handleErrorMiddelware;