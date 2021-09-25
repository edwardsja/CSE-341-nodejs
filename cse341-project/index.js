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

const app = express();

// Route setup. You can implement more in the future!
const ta01Routes = require('./routes/ta01');

//week2
const ta02Routes = require('./routes/ta02');
const w2_adminData = require('./routes/prove02-admin');
const w2_shopRoutes = require('./routes/prove02-shop');

// week 3
const ta03Routes = require('./routes/ta03');

// week 4
const ta04Routes = require('./routes/ta04');


app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(express.urlencoded({extended: true}))
  .use(express.json()) // For parsing the body of a POST
  .use('/ta01', ta01Routes)
  .use('/ta02', ta02Routes)
  .use('/week2', w2_shopRoutes)
  .use('/week2/admin', w2_adminData.routes)
  .use('/ta03', ta03Routes)
  .use('/ta04', ta04Routes)
  .get('/', (req, res, next) => {
    // This is the primary index, always handled last.
    res.render('index', {
      title: 'Welcome to my CSE341 repo',
      path: '/',
    });
  })
  .use((req, res, next) => {
    // 404 page
    res.render('404', { title: '404 - Page Not Found', path: req.url });
  })
  .listen(process.env.PORT || 5000, () => console.log(`Listening on ${PORT}`));
