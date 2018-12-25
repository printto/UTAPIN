//Init App
const mongoose = require('mongoose');
const db = mongoose.connection;
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

//Bring in Models
let User = require('./models/user');

const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

var new_arrival_product = ['Abyss', 'Abyss'];

mongoose.connect(config.database, {
  useNewUrlParser: true
});

db.on('error', console.error.bind(console, 'connection error:'));
//Check connection.
db.once('open', function() {
  console.log('connected to MongoDB.')
});


app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//Expression Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Expression Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      parm: formParam,
      msg: msg,
      value: value
    };
  }
}));

//Passport Config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Home Route
app.get('/', function(req, res) {
  res.render('home',{
    title: "Home"
  });
});

// Route Files
let account = require('./routes/account');
let utau = require('./routes/utau');

app.use('/account', account);
app.use('/utau', utau);

//set public folder.
app.use(express.static(path.join(__dirname, 'public')));
//Start the server.
app.listen(process.env.PORT || 3000, () => console.log('UTAPIN listening on port 3000!'))
