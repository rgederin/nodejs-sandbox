const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// Setup routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

// Setup needfull settings for template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Register body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// Register static middleware for serving static css files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFound);

app.listen(3000);
