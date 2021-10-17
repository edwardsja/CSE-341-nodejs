const Product = require('../models/prove05-product');
const Order = require('../models/prove05-order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/prove05-product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/week5/products'
      });
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/prove05-product-detail', {product: product, pageTitle: product.title, path: '/week5/products'})
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/prove05-index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/week5'
      });
    });
};

exports.getCart = (req, res, next) => {
  console.log(req.user);
  req.user
  .populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items;
    res.render('shop/prove05-cart', {
      path: '/week5/cart',
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
    res.redirect('/week5/cart');
  });
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/week5/cart');
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
        email: req.user.email,
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
    res.redirect('/week5/orders');
  })
  .catch(err => {
    console.log(err);
  });
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/prove05-orders', {
        path: '/week5/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/prove05-checkout', {
    path: '/week5/checkout',
    pageTitle: 'Checkout'
  });
};
