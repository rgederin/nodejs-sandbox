const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// Setup routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Setup needfull settings for template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Register body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// Register static middleware for serving static css files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(3000);
