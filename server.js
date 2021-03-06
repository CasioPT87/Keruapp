if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var helmet = require('helmet');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');
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

//usamos helmet que es una coleccion de 9 middlewares de seguridad
app.use(helmet());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, {uri_decode_auth: true}, (err, connection) => {
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
  origin: ['http://localhost:4200', 'https://www.keruapp.com'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions));

//cuando estamos utilizando el login normal, creo que aqui es donde se ve si la cookie es la que tiene que ser o no hay cookie
// y si hay cookie, se meter el numbre del user es req.user y la session en req.session
app.use(cookieSession({
  name: 'pepito', // mas seguro que esto, impossiball
  keys: [keys.session.cookieKey],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  httpOnly: true,

}))

// lets initialize passport (with this middleware) now that we've setted up the cookie
app.use(passport.initialize());
// we tell passport to use session cookies:
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

//aqui llamamos al sanitizer, que usaremos como middleware en todas y cada una de las rutas
app.use(expressSanitizer());

app.use('/', index);
app.use('/users', users);
app.use('/auth', auths);
app.use('/hero', heroes);
app.use('/map', maps);
app.use('/post', posts);
app.use('/comment', comments);
app.use('/file', files);

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
