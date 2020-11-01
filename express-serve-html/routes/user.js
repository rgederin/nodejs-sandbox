const express = require('express');
const path = require('path');

const router = express.Router();
const users = [];

router.post('/create', (req, res, next) => {
    users.push(req.body.username);
    console.log(users);
});

router.get('/create', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'create-user.html'))
});

router.get('/all', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'users.html'))
});

module.exports = router;