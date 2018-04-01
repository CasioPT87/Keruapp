var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Post = require('../models/Post');
var checkAuthService = require('../services/authService');

/* GET users listing. */
router.get('/:username', checkAuthService.checkAuth, function(req, res, next) {

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

// router.post('/createuser', function(req, res, next) {

//     if ( req.body.username && req.body.password){
     
//       var user = {
//         username: req.body.username,
//         password: req.body.password,
//         description: req.body.description,
//         url: req.body.url   
//       }
  
//       User.create(user, function (error, user) {
//         if (error) {
//           console.log(error)
//           return next(error);
//         } else {
//           return res.json(user);
//         }
//       });
  
//     } else {
//       res.send('algo has hecho mal salvando al user, babe')
//     }
// });

module.exports = router;
