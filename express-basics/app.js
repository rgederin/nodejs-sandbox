const express = require('express');
const bodyParser = require('body-parser')

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(mainRoutes);
app.use('/user', userRoutes);

app.listen(3000);