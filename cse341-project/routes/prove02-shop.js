const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../util/path');
const adminData = require('./prove02-admin');



router.get('/', (req, res, next) => {
    const products = adminData.products;
    res.render('prove02-shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/week2'
    })
});

module.exports = router;
