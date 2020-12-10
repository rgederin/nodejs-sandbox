const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');


const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDbStore({
  uri: ('mongodb+srv://rgederin:rownUovIp5jHzPQ2@cluster0.9acrc.mongodb.net/onlineshop?retryWrites=true&w=majority'),
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


const loginRoutes = require('./routes/auth/login');
const signupRoutes = require('./routes/auth/signup');
const resetRoutes = require('./routes/auth/reset');
const logoutRoutes = require('./routes/auth/logout');
const newPasswordRoutes = require('./routes/auth/new-password');
const e = require('express');


const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + "-" + file.originalname);
  }
});


const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/png'
    || file.mimetype === 'image/jpg'
    || file.mimetype === 'image/jpeg') {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(loginRoutes);
app.use(signupRoutes);
app.use(resetRoutes);
app.use(logoutRoutes);
app.use(newPasswordRoutes);

app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.redirect('/500');
});

mongoose.connect('mongodb+srv://rgederin:rownUovIp5jHzPQ2@cluster0.9acrc.mongodb.net/onlineshop?retryWrites=true&w=majority')
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });



