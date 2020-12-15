const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const multerUtils = require('./utils/multerUtils');
const middlewareUtils = require('./utils/middlewareUtils');

const app = express();

app.use(bodyParser.json());
app.use(multer(multerUtils.multerSetup).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(middlewareUtils.corsHeadersMiddelware);

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use(middlewareUtils.handleErrorMiddelware);

mongoose.connect('mongodb+srv://rgederin:rownUovIp5jHzPQ2@cluster0.9acrc.mongodb.net/blog?retryWrites=true&w=majority')
    .then(result => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });