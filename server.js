// server.js

// set up ======================================================================
// get all the tools we need
var log4js = require('log4js');
var express  = require('express');
var path = require('path');
var log = log4js.getLogger("app");
var app      = express();
var Config   = require('./config');
var port     = Config.Port;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var exphbs = require('express-handlebars');
var helpers = require('./admin/shared/helpers');
var hbs = exphbs.create({
    defaultLayout: 'layout',
    extname: '.hbs',
    helpers: helpers
});


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
//require('./init')();
require('./config/passport')(passport); // pass passport for configuration
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(compression());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(flash()); // use connect-flash for flash messages stored in session

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); // set up ejs for templating

// required for passport
app.use(session({ secret: '1ee82d2-11a0d85-1013445-1c383e6' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./admin/routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport
// routes ======================================================================
require('./app/routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);

app.use(function(err, req, res, next) {
  log.error("wrong:", err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
console.log('The magic happens on port ' + port);
