var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
// con este require corremos el codigo del archivo
var passportSetup = require('./config/passport-setup');
var passport = require('passport');
var aws = require('aws-sdk');
aws.config.region = 'eu-west-1'; // let's set the region to ireland, where we have the bucket;
var keys = require('./config/keys');
const cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
var auths = require('./routes/auths');
var heroes = require('./routes/heroes');
var maps = require('./routes/maps');
var posts = require('./routes/posts');
var comments = require('./routes/comments');
var files = require('./routes/files');

var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, (err, connection) => {
  if (err) throw Error(err);
  else console.log('db listening!!')
})

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var corsOptions = {
  credentials: true,
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))

app.use(cookieSession({
  name: 'pepito', // mas seguro que esto, impossiball
  keys: [keys.session.cookieKey],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// lets initialize passport (with this middleware) now that we've setted up the cookie
app.use(passport.initialize());
// we tell passport to use session cookies:
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/auth', auths);
app.use('/hero', heroes);
app.use('/map', maps);
app.use('/post', posts);
app.use('/comment', comments);
app.use('/files', files);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(res.locals.error);
});

module.exports = app;
