const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

const userRoutes = require('./routes/user');
const { publicDecrypt } = require('crypto');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user', userRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'));
});

app.listen(3000);