var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Post = require('../models/Post');
var checkAuthService = require('../services/authService');
var bcrypt = require('bcrypt');
var moment = require('moment');

/* GET users listing. */
router.get('/getuser/:username', checkAuthService.checkAuth, function(req, res, next) {
  var username = req.params.username;
  
  User.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        console.log(err)
          return callback(err)
      } else if (user) { 
        var dataUserResponse = {
          user: user,
          authorised: res.locals.authorised,
          ownProfile: false,
          posts: []
        }
        if (res.locals.authorised) {
          var clientUsername = res.locals.user.username;
          if (clientUsername === username ) dataUserResponse.ownProfile = true;
        }
        Post.find({ user: user._id }, function(err, posts) {
          if (err) console.log(err);
          else {
            console.log(posts)
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
  if (authorised && user) {

    //formatting dates:
    var dateCreated = new Date(user.dateCreated);
    var dateModified = new Date(user.dateModified);

    var dateCreatedLocale = moment(dateCreated);
    var dateModifiedLocale = moment(dateModified);
    moment.locale('es');
    dateCreatedLocale.locale(false);
    dateModifiedLocale.locale(false);
    ///////////////////

    var objUserResponse = {
      username: user.username,
      dateCreated: dateCreatedLocale.format('LLLL'),
      dateModified: dateModifiedLocale.format('LLLL'),
      description: user.description,
      url: user.url,
      favoritePosts: [],
      likes: 0,
      imageURL: user.imageURL,
      error: false
    }

    Post.find({ usersThatLikePost: user._id })
      .exec(function (err, postsLikedByUser) {
        if (err) {
          console.log(err)
            return err;
        } else if (postsLikedByUser) {
          objUserResponse.favoritePosts = postsLikedByUser;
          // now we calculate how many likes the user has
          Post.find({ user: user._id }, function(err, postsOfUser) {
            if (err) console.log(err);
            var numLikesUser = 0;
            for (var i = 0; i < postsOfUser.length; i++) {
              var thisPost = postsOfUser[i];
              var numBerLikesThisPost = thisPost.usersThatLikePost.length;
              numLikesUser += numBerLikesThisPost;
            }
            objUserResponse.likes = numLikesUser;
            console.log(objUserResponse)
            res.json(objUserResponse);
          }) 
        }
    });
  } else {
    res.json({
      error: true
    })
  }
});

router.put('/update', checkAuthService.checkAuth, function(req, res, next) {

  var authorised = res.locals.authorised;
  var user = res.locals.user;
  var successResponse = {
    error: true // we will change it later when succeed
  }

  if (authorised && user) {

    var usernameUpdateUser = req.body.userName;
    var passwordUpdateUser = req.body.password;
    var descriptionUpdateUser = req.body.description;
    var urlUpdateUser = req.body.url;
    var imageURLUser = req.body.imageURL;

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
        imageURL: imageURLUser !== "" ? imageURLUser : imageURLOldUser,
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
