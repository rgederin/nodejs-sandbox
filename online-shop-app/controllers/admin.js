const Product = require('../models/product');
const { validationResult } = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: '',
    oldInput: {
      title: '',
      price: '',
      confirmPassword: '',
      description: ''
    },
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422)
      .render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        errorMessage: 'Attached file is not an image',
        oldInput: {
          title: title,
          price: price,
          description: description
        },
        validationErrors: []
      });
  }

  const errors = validationResult(req);



  if (!errors.isEmpty()) {
    return res.status(422)
      .render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errorMessage: errors.array()[0].msg,
        oldInput: {
          title: title,
          price: price,
          description: description
        },
        validationErrors: errors.array()
      });
  }

  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });

  product.save()
    .then(result => {
      console.log('product created...');
      res.redirect('/admin/products');
    })
    .catch(err => {
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCOde = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMessage: '',
        validationErrors: [],

      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {

  console.log('in post edit');
  const prodId = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const image = req.file;
  const description = req.body.description;



  Product.findById(prodId)
    .then(product => {

      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }

      product.title = title;
      product.price = price;
      product.description = description;

      if (image) {
        product.imageUrl = image.path;
      }

      return product.save()
        .then(result => {
          console.log('product was updated ...');
          res.redirect('/admin/products');
        });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  //display products created by user
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
