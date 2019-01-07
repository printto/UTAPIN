const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//const flash = require('req-flash');

//Bring in User model
let User = require('../models/user');

router.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Register form
router.get('/register', ensureUnauthenticated, function(req, res) {
  res.render('register');
});

//Register form
router.get('/login-register', ensureUnauthenticated, function(req, res) {
  res.render('login-register');
});

//Register Process
router.post('/register', function(req, res) {
  regis(req, res, false);
});

function regis(req, res, adminBoolean) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  const password2 = req.body.password2;
  const country = req.body.country;
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Confirm Password does not match').equals(password);
  let errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      country: country
    });
  } else {
    let query = {
      username: username.toLowerCase()
    };
    User.findOne(query, function(err, user) {
      if (err) throw err;
      if (!user) {
        let query2 = {
          email: email
        };
        User.findOne(query2, function(err2, user2) {
          if (err2) throw err2;
          if (!user2) {
            let query3 = {
              name: name
            };
            User.findOne(query3, function(err3, user3) {
              if (err3) throw err3;
              if (!user3) {
                let newUser = new User({
                  name: name,
                  email: email,
                  username: username,
                  password: password,
                  country: country
                });
                bcrypt.genSalt(10, function(err, salt) {
                  bcrypt.hash(newUser.password, salt, function(err, hash) {
                    if (err) {
                      console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save(function(err) {
                      if (err) {
                        console.log(err);
                        return;
                      } else {
                        req.flash('success', 'You are now registered and can be log in with this account.');
                        res.redirect('/account/login');
                      }
                    })
                  });
                });
              }
              else{
                req.flash('danger', 'This name is already used.');
                res.redirect('back');
              }
            });
          } else {
            req.flash('danger', 'This email is already used.');
            res.redirect('back');
          }
        })
      } else {
        req.flash('danger', 'Username already exist.');
        res.redirect('back');
      }
    });
  }
}

//Login Form
router.get('/login', ensureUnauthenticated, function(req, res) {
  res.render('login');
});
//Login Process
router.post('/login', function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: 'back',
    failureRedirect: 'back',
    failureFlash: true
  })(req, res, next);
});
//Login Process with next page
router.post('/login/:nextPage', function(req, res, next) {
  var nextPage = req.params.nextPage;
  if(nextPage === "home") nextPage = '/';
  passport.authenticate('local', {
    successRedirect: nextPage,
    failureRedirect: '/account/login',
    failureFlash: true
  })(req, res, next);
});

//Logout
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('back');
});

//Edit user
router.get('/edit', loggedIn, function(req, res) {
  res.flash('danger', 'Sorry, editing account information is not available at the moment.');
  res.redirect('back');
});
// router.post('/edit_address', function(req, res) {
//   const address = req.body.address;
//   const address2 = req.body.address2;
//   const address3 = req.body.address3;
//   const address4 = req.body.address4;
//   // const address5        = req.body.address5;
//   const tel_num = req.body.tel_num;
//   req.checkBody('address', 'Address is required').notEmpty();
//   req.checkBody('address2', 'District is required').notEmpty();
//   req.checkBody('address3', 'Province is required').notEmpty();
//   req.checkBody('address4', 'Postal Code is required').notEmpty();
//   // req.checkBody('address5', 'Country is required').notEmpty();
//   req.checkBody('tel_num', 'Telephone number is required').notEmpty();
//   let errors = req.validationErrors();
//   if (errors) {
//     if (req.user) {
//       res.render('edit_address', {
//         errors: errors,
//         user: req.user
//       });
//     } else res.redirect('/account/edit_address');
//   } else {
//     let user = {};
//     user.address = address;
//     user.address2 = address2;
//     user.address3 = address3;
//     user.address4 = address4;
//     // user.address5 = address5;
//     user.address5 = 'Thailand';
//     user.tel_num = tel_num;
//     let query = {
//       _id: req.user._id
//     };
//     User.updateOne(query, user, function(err) {
//       if (err) {
//         console.log(err)
//         return
//       } else {
//         req.flash('success',"Your informations updated");
//         res.redirect('/account/profile');
//       }
//     })
//   }
// });

//Access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next();
    } else {
      req.flash('danger', 'Please login as admin account');
      res.redirect('/account/login');
    }
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/account/login');
  }
}

//Logged in
function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/account/login');
  }
}

//Access control
function ensureUnauthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'You are already logged in');
    res.redirect('/');
  }
}

module.exports = router;
