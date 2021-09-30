const Product = require('../models/prove03-product');
const Cart = require('../models/prove03-cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/prove03-product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/week3/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render('shop/prove03-product-detail', {product: product, pageTitle: product.title, path: '/week3/products'})
  });
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/prove03-index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/week3'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (products of products) {
        const cartProductData = cart.products.find(prod => prod.id === products.id);
        if (cartProductData) {
          cartProducts.push({productData: products, qty: cartProductData.qty});
        }
      }
      res.render('shop/prove03-cart', {
        path: '/week3/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/week3/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/week3/cart');
  });
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
