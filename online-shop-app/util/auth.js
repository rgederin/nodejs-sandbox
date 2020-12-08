const googleTransporter = {
    service: 'gmail',
    auth: {
        user: 'gederin.ruslan@gmail.com',
        pass: '452629996'
    }
};

const extractErrorMessage = (req) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    return message;
}

exports.googleTransporter = googleTransporter;
exports.extractErrorMessage = extractErrorMessage;
