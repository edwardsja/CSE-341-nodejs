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
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');


const MONGODB_URI = 'mongodb+srv://aaronedwards:f6WBkTXtNv8HuRRD@cluster0.cpjqs.mongodb.net/project?w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

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

// week 5
const w5_adminRoutes = require('./routes/prove05-admin');
const w5_shopRoutes = require('./routes/prove05-shop');
const w5_authRoutes = require('./routes/prove05-auth');

const User = require('./models/prove05-user');

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(express.urlencoded({extended: true}))
  .use(express.json()) // For parsing the body of a POST
  .use(session({secret: 'longstringvalue12345', resave: false, saveUninitialized: false, store: store}))
  .use(csrfProtection)
  .use(flash())
  .use((req, res, next) => {
    // User.findById('6160b72c8cd77764284594f8')
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
      if (!req.session.user) {
        return next();
      }
      User.findById(req.session.user._id)
          .then(user => {
              req.user = user;
              console.log(req.session);
              console.log(req.user);
              next(); 
          })
          .catch(err => {
              console.log(err);
          })
        
  })
  .use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
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
  .use('/week5', w5_shopRoutes)
  .use('/week5/admin', w5_adminRoutes)
  .use('/week5', w5_authRoutes)
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
        app.listen(process.env.PORT || 5000, () => console.log(`Listening on ${PORT}`));
    })
