const Product = require('../models/prove04-product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/prove04-edit-product', {
    pageTitle: 'Add Product',
    path: '/week4/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user})
    .save()
    .then()
    .catch(err => {
      console.log(err)
    });
  res.redirect('/week4');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/week4');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/week4');
      }
      res.render('admin/prove04-edit-product', {
        pageTitle: 'Edit Product',
        path: '/week4/admin/edit-product',
        editing: editMode,
        product: product
      });
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      return product.save();
    })
    .then(result => {
      res.redirect('/week4/admin/products');
    });
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/prove04-products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/week4/admin/products'
      });
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      res.redirect('/week4/admin/products');
    });
}
