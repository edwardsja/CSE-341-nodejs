/*******************************************************************************
 * Feel free to remove this comment block and all other comments after pulling.
 * They're for information purposes only.
 *
 * This layout is provided to you for an easy and quick setup to either pull
 * or use to correct yours after working at least 1 hour on Team Activity 02.
 * Throughout the course, we'll be using Express.js for our view engines.
 * However, feel free to use pug or handlebars ('with extension hbs'). You will
 * need to make sure you install them beforehand according to the reading from
 * Udemy course.
 * IMPORTANT: Make sure to run "npm install" in your root before "npm start"
 *******************************************************************************/
// Our initial setup (package requires, port number setup)
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000
const mongoose = require('mongoose');

const app = express();

// Route setup. You can implement more in the future!
const ta01Routes = require('./routes/ta01');

//week2
const ta02Routes = require('./routes/ta02');
const w2_adminData = require('./routes/prove02-admin');
const w2_shopRoutes = require('./routes/prove02-shop');

// week 3
const ta03Routes = require('./routes/ta03');
const w3_adminRoutes = require('./routes/prove03-admin');
const w3_shopRoutes = require('./routes/prove03-shop');

// week 4
const ta04Routes = require('./routes/ta04');
const w4_adminRoutes = require('./routes/prove04-admin');
const w4_shopRoutes = require('./routes/prove04-shop');

const User = require('./models/prove04-user');

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(express.urlencoded({extended: true}))
  .use(express.json()) // For parsing the body of a POST
  .use((req, res, next) => {
    User.findById('6160b72c8cd77764284594f8')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
  })
  .use('/ta01', ta01Routes)
  .use('/ta02', ta02Routes)
  .use('/week2', w2_shopRoutes)
  .use('/week2/admin', w2_adminData.routes)
  .use('/week3', w3_shopRoutes)
  .use('/week3/admin', w3_adminRoutes)
  .use('/week3/ta03', ta03Routes)
  .use('/ta04', ta04Routes)
  .use('/week4', w4_shopRoutes)
  .use('/week4/admin', w4_adminRoutes)
  .get('/', (req, res, next) => {
    // This is the primary index, always handled last.
    res.render('index', {
      pageTitle: 'Aaron Edwards\' CSE341 Repo',
      path: '/',
    });
  })
  .use((req, res, next) => {
    // 404 page
    res.render('404', { pageTitle: '404 - Page Not Found', path: req.url });
  });

  mongoose.connect('mongodb+srv://aaronedwards:f6WBkTXtNv8HuRRD@cluster0.cpjqs.mongodb.net/project?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Aaron',
                    email: 'aaron@email.com',
                    cart: {
                        items: []
                    }
                }).save();
            }
        })
        app.listen(process.env.PORT || 5000, () => console.log(`Listening on ${PORT}`));
    })
