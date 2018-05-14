
var express = require('express');
var router = express.Router();
const passport = require('passport');
var User = require('../models/User');
var AuthService = require('../services/authService');
var StringLengthService = require('../services/StringLengthService');

// /* GET Login page. */
// router.get('/login', (req, res) => {
//     res.render('login');
// });

/* GET Sigin page. */
router.get('/signin', (req, res) => {
  res.render('signin');
});

// en el archivo passport-setup le hemos dicho a passport como usar la GoogleStrategy.
// ahora lo que le decimos a la app es que dada esta ruta,
// use la GoogleStrategy (que nosotros hemos seteado anteriormente)
router.get('/google', passport.authenticate('google',
  // este segundo parametro es donde le decimos la info del usuario que queremos de Google+
 {
    scope:['profile']
 })
);

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log('hasta aqui hemos llegado!!')

    //res.redirect('http://localhost:4200');
    res.redirect('/');
});

//POST route for sign in
router.post('/createuser', AuthService.checkAuth, function (req, res, next) {
    
  if (!res.locals.authorised) {
    if ( req.body.username && req.body.password ) {

      var username = req.sanitize(req.body.username); 
      var password = req.sanitize(req.body.password);
      var description = req.sanitize(req.body.description);
      var url = req.sanitize(req.body.url);

      var username = StringLengthService.stringLenghtControl(username, 100);
      var password = StringLengthService.stringLenghtControl(password, 100);
      var description = StringLengthService.stringLenghtControl(description, 100);
      var url = StringLengthService.stringLenghtControl(url, 100);

      var userData = {
        username: username,
        password: password,
        description: description,
        url: url,
        dateCreated: Date.now(),
        dateModified: Date.now()
      }
      // check if there's another user with that name
      User.findOne({ username: username })
        .exec(function (err, user) {
          if (err) {
            res.send(err);
          } else if (user) {
            console.log('ey!!, ya hay un usuario con este nombre, artista!!: ' + user.username)
            req.session.userId = user._id;
            res.send({
              authorised: true,
              username: user.username
            });
          } else if (!user) {
            // let's create the user!!
            User.create(userData, function (error, user) {
              if (error) {
                console.log('error')
                console.log(error)
                res.send(err);
              } else {
                req.session.userId = user._id;
                res.send({
                  authorised: true,
                  username: user.username
                });
              }
            });
          }
        })

    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      res.send(err);
    }

  } else if (res.locals.authorised) {
    res.send({
      authorised: true,
      username: res.locals.user.username
    })
  }  
})

//POST route for sign in
router.post('/login', function (req, res, next) {
  var username = req.sanitize(req.body.username);
  var password = req.sanitize(req.body.password);
  var username = StringLengthService.stringLenghtControl(username, 100);
  var password = StringLengthService.stringLenghtControl(password, 100);

  if (username && password) {
    console.log(username, password )
    User.authenticate(username, password, function (error, user) {
      if (error) {
        console.log('error:'+ error)
        res.send({
          authorised: false,
          error: 'Usuario o password incorrecto'
        });
      }
      else if (!user) {
        res.send({
          authorised: false,
          error: 'Usuario o password incorrecto'
        });
      }
      else if (user) {
        req.session.userId = user._id;
        console.log(`Has iniciado sesion con el usuario: ${user.username}`)
        res.send({
          authorised: true,
          error: false
        });
      }
    });
  } else {
    res.send({
      authorised: false,
      error: 'No username or password supplied'
    });
  }
})

  // GET for logout logout
router.get('/logout', function (req, res, next) {
  console.log(req.session)
  if (req.session && Object.keys(req.session).length > 0) {
    console.log('hay session!!')
    if (req.session.userId) delete req.session.userId;
    if (req.session.passport) delete req.session.passport;
    console.log(req.session)
    res.send(false);
    // req.session.destroy(function (err) {
    //      //Inside a callback… bulletproof!
    // });
    
  } else {
    console.log('NO hay session!!')
    console.log(req.session)
    res.send(false);
  }
  
});

router.get('/checkauth', AuthService.checkAuth, function (req, res, next) {
  console.log(res.locals)
  res.send({ authorised: res.locals.authorised, methodIdent: res.locals.methodIdentification });
});

module.exports = router;
