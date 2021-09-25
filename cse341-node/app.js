const path = require('path');

const express = require('express');
//const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './cse341-node/views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({extended: true}))
    .use(express.json())
    .use(express.static(path.join(__dirname, 'public')))
    .use('/admin', adminData.routes)
    .use(shopRoutes)
    .use((req, res, next) => {
        res.status(404).render('404', { title: 'Page Not Found' });
    })
    .listen(3000);
 