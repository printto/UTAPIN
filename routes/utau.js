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

router.get('/profile', loggedIn, function(req, res) {
  Utau.find({}, function(err, utaus) {
    if (err) {
      req.flash('danger', 'Error connecting to database: '+err);
      res.redirect('/');
    } else {
      res.render('all_utau', {
        title: "My UTAUloids",
        utaus: utaus
      });
    }
  })
});

//Add UTAU form
router.get('/add', loggedIn, function(req, res) {
  res.render('add_utau', {
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
  const voicebank = req.body.voicebank;
  const creator = req.body.creator;
  const voicer = req.body.voicer;
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
      personality: personality,
      voicebank: voicebank,
      creator: creator,
      voicer: voicer
    });
  } else {
    let query = {
      name: name
    };
    Utau.findOne(query, function(err, utau) {
      if (err) throw err;
      if (!utau) {
        var temp_utau = new Utau({
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
          related: related.split(","),
          age: age,
          homepage: homepage,
          chara_item: chara_item,
          media_list: media_list.split(","),
          birthday: birthday,
          release: release,
          personality: personality,
          voicebank: voicebank.split("\r\n"),
          owner: req.user._id,
          creator: creator,
          voicer: voicer
        });
        temp_utau.save(function(err, added_utau) {
          if (err) {
            console.log(err);
            return;
          } else {
            let temp_user = {};
            var utau_list = req.user.utau;
            utau_list.push(added_utau._id);
            temp_user.utau = utau_list;
            let query = {
              _id: req.user._id
            };
            User.updateOne(query, temp_user, function(err2) {
              if (err2) {
                console.log(err2)
                return
              } else {
                req.flash('success', "Saved your UTAUloid's profile.");
                res.redirect('/utau/profile');
              }
            })
          }
        });
      } else {
        req.flash('danger', 'That UTAU is already exist.');
        res.redirect('back');
      }
    });
  }
});

//Edit UTAU form
router.get('/edit/:id', loggedIn, function(req, res) {
  Utau.findById(req.params.id, function(err, utau){
    if(!utau){
      req.flash('danger', "Invalid URL.");
      res.redirect('/');
    }
    else if(!req.user.utau.includes(req.params.id)){
      req.flash('danger', "You are not the owner of this UTAU, URL permission denied.");
      res.redirect('/utau/profile');
    }
    else{
      res.render('edit_utau', {
        title: "Edit UTAU",
        utau: utau
      });
    }
  });
});
router.post('/edit', loggedIn, function(req, res) {
  const utau_id = req.body.id;
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
  const voicebank = req.body.voicebank;
  const cssAndScript = req.body.cssAndScript;
  const creator = req.body.creator;
  const voicer = req.body.voicer;
  let errors = req.validationErrors();
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('short_description', 'Description is required').notEmpty();
  if (errors) {
    res.redirect('/utau/edit/'+utau_id);
  }
  else {
    var temp_utau = {
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
      related: related.split(","),
      age: age,
      homepage: homepage,
      chara_item: chara_item,
      media_list: media_list.split(","),
      birthday: birthday,
      release: release,
      personality: personality,
      voicebank: voicebank.split("\r\n"),
      cssAndScript: cssAndScript,
      creator: creator,
      voicer: voicer
    };
    var query = {
      _id: utau_id
    }
    Utau.updateOne(query, temp_utau, function(err) {
      if (err) {
        console.log(err)
        return
      } else {
        req.flash('success', "Saved your UTAUloid's profile.");
        res.redirect('/utau/profile');
      }
    });
  }
});

//Load UTAU profile homepage
router.get('/:id', function(req, res) {
  Utau.findById(req.params.id, function(err, utau){
    if(!utau){
      //Search by name
      var name = req.params.id.replace('_', ' ' );
      var query = {
        name: name
      }
      Utau.findOne(query, function(err2, utau2){
        if(!utau2){
          req.flash('danger', "Invalid URL.");
          res.redirect('/');
        }
        else{
          res.render('utau_profile', {
            title: utau2.name,
            utau: utau2
          });
        }
      });
    }
    else{
      res.render('utau_profile', {
        title: utau.name,
        utau: utau
      });
    }
  });
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

function dataToHtml(content) {
    content = content.replace('\r\n', '<br />' );
    return content;
};

module.exports = router;
