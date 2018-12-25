const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//const flash = require('req-flash');

//Bring in User model
let User = require('../models/user');
let Utau = require('../models/utau');

router.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Add UTAU form
router.get('/add', loggedIn, function(req, res) {
  res.render('add_utau',{
    title: "Create UTAU"
  });
});

//Add UTAU
router.post('/add', loggedIn, function(req, res) {
  const name = req.body.name;
  const short_description = req.body.short_description;
  const gender = req.body.gender;
  const genre = req.body.genre;
  const weight = req.body.weight;
  const height = req.body.height;
  const like = req.body.like;
  const dislike = req.body.dislike;
  const flags = req.body.flags;
  const image = req.body.image;
  const range = req.body.range;
  const related = req.body.related;
  const age = req.body.age;
  const homepage = req.body.homepage;
  const chara_item = req.body.chara_item;
  const media_list = req.body.media_list;
  const birthday = req.body.birthday;
  const release = req.body.release;
  const personality = req.body.personality;
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('short_description', 'Description is required').notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    res.render('add_utau', {
      errors: errors,
      name: name,
      short_description: short_description,
      gender: gender,
      genre: genre,
      weight: weight,
      height: height,
      like: like,
      dislike: dislike,
      flags: flags,
      image: image,
      range: range,
      related: related,
      age: age,
      homepage: homepage,
      chara_item: chara_item,
      media_list: media_list,
      birthday: birthday,
      release: release,
      personality: personality
    });
  } else {
    let query = {
      name: name
    };
    Utau.findOne(query, function(err, utau) {
      if (err) throw err;
      if (!utau) {
        //TODO: Save UTAU profile to database
      } else {
        req.flash('danger', 'That UTAU is already exist.');
        res.redirect('back');
      }
    });
  }
});

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