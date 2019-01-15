const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//const flash = require('req-flash');

//Bring in User model
let User = require('../models/user');
let Utau = require('../models/utau');
let Pin = require('../models/pin');

router.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

router.get('/', function(req, res) {
  res.render('pins');
});

// router.get('/test', function(req, res) {
//   Utau.find( {} , function(err, utau){
//     res.send( utau );
//   } );
// });

//Logged in
function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/account/login');
  }
}

//Sorter
function sortObjectBy(property) {
    var sortOrder = 1;
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

module.exports = router;
