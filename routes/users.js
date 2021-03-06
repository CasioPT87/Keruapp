var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Post = require('../models/Post');
var checkAuthService = require('../services/authService');
var bcrypt = require('bcrypt');
var moment = require('moment');
var StringLengthService = require('../services/stringLengthService');

/* GET users listing. */
router.get('/getuser/:username', checkAuthService.checkAuth, function(req, res, next) {

  var username = req.sanitize(req.params.username);
  username = StringLengthService.stringLenghtControl(username, 100);
  var dataUserResponse = {};

  User.findOne({ username: username })
    .exec(function (err, user) {
      if (err || !user) {
        console.log(err || "usuario no encontrado")
        dataUserResponse.error = true;
        res.json(dataUserResponse);
      } else { 
        var dateCreatedLocale = moment(user.dateCreated);
        moment.locale('en-gb');
        dateCreatedLocale.locale(false);

        dataUserResponse = {
          user: user,
          authorised: res.locals.authorised,
          ownProfile: false,
          posts: [],
          likes: 0,
          dateCreated: dateCreatedLocale.format('LLLL'),
          error: false
        }
        if (res.locals.authorised) {
          var clientUsername = res.locals.user.username;
          if (clientUsername === username ) dataUserResponse.ownProfile = true;
        }
        Post.find({ user: user._id }, function(err, posts) {
          if (err) {
            console.log(err)
            dataUserResponse.error = true;
            res.json(dataUserResponse);
          }
          if (posts) {
            new Promise((resolve, reject) => {
              var numLikes = countLikesInPosts(posts);
              numLikes = Number(numLikes);  // con esto nos aseguramos que si es null o false, nos devuelva 0
              if (numLikes >= 0) resolve(numLikes);
              if (!numLikes) reject(new Error('error contando el numero de likes en los posts'));
            })
              .then((numLikes) => {
                dataUserResponse.likes = numLikes;
                dataUserResponse.posts = posts;
                res.json(dataUserResponse);
              })
              .catch((err) => {
                console.log(err)
                dataUserResponse.likes = 0;
                dataUserResponse.posts = posts;
              })
          }
          if (!posts) {
            dataUserResponse.likes = 0;
            dataUserResponse.posts = posts;
            res.json(dataUserResponse);
          }
        })
        
      }
    });  
});

router.get('/currentuser', checkAuthService.checkAuth, function(req, res, next) {

  var authorised = res.locals.authorised;
  var user = res.locals.user;
  var methodIdent = res.locals.methodIdentification;

  if (authorised && user && methodIdent) {

    //formatting dates:
    var dateCreated = new Date(user.dateCreated);
    var dateModified = new Date(user.dateModified);

    var dateCreatedLocale = moment(dateCreated);
    var dateModifiedLocale = moment(dateModified);
    moment.locale('en-gb');
    dateCreatedLocale.locale(false);
    dateModifiedLocale.locale(false);
    ///////////////////

    var objUserResponse = {
      username: user.username,
      dateCreated: dateCreatedLocale.format('LLLL'),
      dateModified: dateModifiedLocale.format('LLLL'),
      description: user.description,
      url: user.url,
      //favoritePosts: [],
      likes: 0,
      imageURL: user.imageURL,
      error: false,
      authorised: authorised,
      methodIdent: methodIdent
    }

    //posts de este usuario
    // now we calculate how many likes the user has
    Post.find({ user: user._id }, function(err, postsOfUser) {
      if (err) {
        console.log(err);
        objUserResponse.error = "Error recuperando datos del usuario";
        res.json(objUserResponse);
      } else {
        var numLikesUser = 0;
        for (var i = 0; i < postsOfUser.length; i++) {
          var thisPost = postsOfUser[i];
          var numBerLikesThisPost = thisPost.usersThatLikePost.length;
          numLikesUser += numBerLikesThisPost;
        }
        objUserResponse.likes = numLikesUser;
        res.json(objUserResponse);
      }     
    })
    
    // esto es para ver que posts le gustan al current user. no sirve, pero lo dejo aqui por si me sirve en futuro
    // //a ver que post le gustan a este user
    // Post.find({ usersThatLikePost: user._id })
    //   .exec(function (err, postsLikedByUser) {
    //     if (err) {
    //       console.log(err)
    //       res.json({
    //         error: true
    //       })
    //     } else if (postsLikedByUser) {
    //       objUserResponse.favoritePosts = postsLikedByUser;
    //       // now we calculate how many likes the user has
    //       Post.find({ user: user._id }, function(err, postsOfUser) {
    //         if (err) console.log(err);
    //         var numLikesUser = 0;
    //         for (var i = 0; i < postsOfUser.length; i++) {
    //           var thisPost = postsOfUser[i];
    //           var numBerLikesThisPost = thisPost.usersThatLikePost.length;
    //           numLikesUser += numBerLikesThisPost;
    //         }
    //         objUserResponse.likes = numLikesUser;
    //         res.json(objUserResponse);
    //       }) 
    //     } else if (!postsLikedByUser) {
    //       // hay usuario pero no sabemos cuantos likes tiene (tiene 0). devolvemos el usuario tal cual, pero con 0 likes
    //       console.log('el usuario nunca ha recibido un like en un post')
    //       res.json(objUserResponse);
    //     }
    // });
  } else {
    res.json({
      error: true
    })
  }
});

router.get('/currentusername', checkAuthService.checkAuth, function(req, res, next) {

  var authorised = res.locals.authorised;
  var user = res.locals.user;
  if (authorised && user) {
    var objUserResponse = {
      username: user.username,
    }
    res.json(objUserResponse)
  } else {
    res.send(null);
  }

    
});

router.put('/update', checkAuthService.checkAuth, function(req, res, next) {

  var authorised = res.locals.authorised;
  var user = res.locals.user;
  var successResponse = {
    error: true // we will change it later when succeed
  }

  if (authorised && user) {

    var usernameUpdateUser = req.sanitize(req.body.userName);
    var passwordUpdateUser = req.sanitize(req.body.password);
    var descriptionUpdateUser = req.sanitize(req.body.description);
    var urlUpdateUser = req.sanitize(req.body.url);
    var imageURLUser = req.sanitize(req.body.imageURL);

    User.findById(user._id, function(err, oldUser) {
      if (err) console.log(err);
      var usernameOldUser = oldUser.username;
      var passwordOldUser = oldUser.password;
      var descriptionOldUser = oldUser.description;
      var urlOldUser = oldUser.url;
      var imageURLOldUser = oldUser.imageURL;

      var dateUserModified = Date.now();

      var update = {
        username: usernameUpdateUser !== "" ? usernameUpdateUser : usernameOldUser,
        description: descriptionUpdateUser !== "" ? descriptionUpdateUser : descriptionOldUser,
        url: urlUpdateUser !== "" ? urlUpdateUser : urlOldUser,
        dateModified: dateUserModified,
        imageURL: imageURLUser && imageURLUser !== "" ? imageURLUser : imageURLOldUser,
        password: ""
      } 

      new Promise((resolve, reject) => {
        if (passwordUpdateUser && passwordUpdateUser !== "") {
          var hashedPassword = hashPassword(passwordUpdateUser);
          if (hashedPassword) resolve(hashedPassword);
          else reject(err);
        } else {
          resolve(passwordOldUser)
        }
      })
        .then((passwordToSet) => {
          console.log('6: '+passwordToSet)
          update.password = passwordToSet;
          User.findByIdAndUpdate(user._id, update, { new: true }, function(err, updatedUser) {
            if (err) console.log(err);
            console.log(updatedUser)
            successResponse.error = false;
            res.json(successResponse)
          })
        }) 
        .catch((err) => {
          console.log(err);
          res.json(successResponse)
        })     
    });  
  } else {
    console.log('el usuario no esta autorizado')
    res.json(successResponse)
  }  
});

function countLikesInPosts(posts) {
  var numLikes = 0;
  for (var i = 0; i < posts.length; i++) {
      var thisPost = posts[i];
      var numLikesInThisPost = thisPost.usersThatLikePost.length;
      numLikes += numLikesInThisPost;      
  }
  return numLikes;
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        reject (err);
      }
      resolve(hash)
    });
  })
}

module.exports = router;
