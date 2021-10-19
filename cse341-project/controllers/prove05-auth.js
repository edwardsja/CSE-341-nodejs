const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/prove05-user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/prove05-login', {
      path: '/week5/login',
      pageTitle: 'Login',
      errorMessage: message
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/prove05-signup', {
        path: '/week5/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/week5/login');
            }
            bcrypt.compare(password, user.password)
            .then(doMatch => {
                    if (doMatch) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/week5');
                        })
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/week5/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/week5/login');
                })
        })
        .catch(err => {
            console.log(err);
        })  
};

exports.postSignup = (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;

   User.findOne({email: email})
    .then(userDoc => {
        if (userDoc) {
            req.flash('error', 'Email exists already.');
            return res.redirect('/week5/signup');
        }
        return bcrypt.hash(password, 12)
            .then(hashPassword => {
                const user = new User({
                    email: email,
                    password: hashPassword,
                    cart: { items: [] }
                });
                return user.save();
            })
            .then(result => {
                res.redirect('/week5/login');
                // return transporter.sendMail({
                //     to: email,
                //     from: 'shop@node-complete.com',
                //     subject: 'Signup Complete!',
                //     html: '<h1>You successfully signed up!</h1>'
                // })
            });
    })
    .catch(err => { console.log(err); });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/week5');
    })
};
  