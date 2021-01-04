export const handleError = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
};

export const throwError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    throw error;
}