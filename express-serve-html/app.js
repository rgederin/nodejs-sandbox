const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

const userRoutes = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user', userRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'));
});

app.listen(3000);