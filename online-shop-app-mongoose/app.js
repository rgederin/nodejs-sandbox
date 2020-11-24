const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const errorController = require('./controllers/error');
// const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.fetchById('5fbb9784af595213af478c2b')
//     .then(user => {
//       req.user = new User(user.username, user.email, user.cart, user._id);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


mongoose.connect('mongodb+srv://rgederin:rownUovIp5jHzPQ2@cluster0.9acrc.mongodb.net/onlineshop?retryWrites=true&w=majority')
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
// mongoConnect(() => {
//   // const user = new User('Ruslan', 'rgederin@lohika.com');
//   // user.save();
//   app.listen(3000);
// });


