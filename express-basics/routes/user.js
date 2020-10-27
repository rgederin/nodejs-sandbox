const express = require('express');

const router = express.Router();
const users = [];

router.post('/create-user', (req, res, next) => {
    users.push(req.body.username);
    res.redirect('/users');
});

router.get('/users', (req, res, next) => {
    let responseHtml = '<html><head><title>Registered users</title></head><body><ul>';

    users.forEach((item, index) => {
        responseHtml += ('<li>' + item + '</li>');
    });

    responseHtml += ('</ul></body></html>');

    res.send(responseHtml);
});

module.exports = router;