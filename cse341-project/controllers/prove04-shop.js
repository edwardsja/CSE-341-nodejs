const Product = require('../models/prove04-product');
const Order = require('../models/prove04-order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/prove04-product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/week4/products'
      });
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/prove04-product-detail', {product: product, pageTitle: product.title, path: '/week4/products'})
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/prove04-index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/week4'
      });
    });
};

exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items;
    res.render('shop/prove04-cart', {
      path: '/week4/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  })
  .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
    return req.user.addToCart(product);
  }).then(result => {
    res.redirect('/week4/cart');
  });
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/week4/cart');
    });
}

exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items.map(i => {
      return {quantity: i.quantity, product: {...i.productId._doc} };
    });
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      products: products
    });
    return order.save()
  })
  .then(result => {
    req.user.clearCart();
  })
  .then(result => {
    res.redirect('/week4/orders');
  })
  .catch(err => {
    console.log(err);
  });
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/prove04-orders', {
        path: '/week4/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/prove04-checkout', {
    path: '/week4/checkout',
    pageTitle: 'Checkout'
  });
};
