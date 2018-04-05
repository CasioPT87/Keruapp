var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var User = require('../models/User');
var MapService = require('../services/mapService');
var AuthService = require('../services/authService');

/* GET users listing. */
router.post('/createpost', AuthService.checkAuth, function(req, res, next) {

  if (res.locals.authorised && res.locals.user) {

    var userId = res.locals.user._id;

    createNewPost(req, userId)
    .then((post) => {
      console.log(post)
      res.send({
        post: post,
        error: false
      });
    })
    .catch((err) => {
      res.send({
        post: false,
        error: `There was an error creating post. Please try again`
      });
    });
  } else {
    res.send({
      post: false,
      error: 'Please log in to create posts'
    });
  }
});

router.put('/likepost', AuthService.checkAuth, function(req, res, next) {

  if (res.locals.authorised && res.locals.user) {

    var postNumber = req.body.postNumber;
    var likePost = false;
    var numLikesInPost = 0;
    var userId = res.locals.user._id;

    Post.findOne({ idNumber: postNumber }, function(err, post) {
      if (err || !post) {
        console.log('Ha habido un error buscando el post')
      } else {
        console.log(post.usersThatLikePost)
        var idPost = post._id;
        var index = post.usersThatLikePost.findIndex((userThatLikePost) => {
          return userThatLikePost.toString() == userId.toString();
        })
        if (index < 0) {
          //todavia no le gusta
          post.usersThatLikePost.push(userId);
          post.save(function(err, postUpdated) {
            numLikesInPost = postUpdated.usersThatLikePost.length;
            
            res.send({
              likePost: true,
              numLikesInPost: numLikesInPost
            });
          })
        } else {
          // ya le gusta
          post.usersThatLikePost.splice(index, 1);
          post.save(function(err, postUpdated) {
            console.log(postUpdated)
            numLikesInPost = postUpdated.usersThatLikePost.length;
            
            res.send({
              likePost: false,
              numLikesInPost: numLikesInPost
            });
          })
        }
      }
    })    
  } else {
    Post.findOne({ idNumber: postNumber }, function(err, post) {
      if (err || !post) {
        console.log('Ha habido un error buscando el post')
      } 
      else {  
        numLikesInPost = post.usersThatLikePost.length;
        res.send({
          likePost: false,
          numLikesInPost: numLikesInPost
        });
      }
    })   
  }
});

router.get('/findposts/:coords', function(req, res, next) {

  var address = req.params.coords;
  
  MapService.getCoordinates(address)
    .then((pointCoords) => {

      var latitude = pointCoords.lat;
      var longitude = pointCoords.lng;

      findClosestsPosts(pointCoords)
        .then((posts) => {
          // we dont want to send any user id in the response
          console.log(posts)
          return res.send({
            posts: posts,
            searchLocation: {'latitude': latitude, 'longitude': longitude},
            error: false
          });
        })
        .catch((err) => {
          console.log(err);
          res.send({
            posts: null,
            searchLocation: {'latitude': latitude, 'longitude': longitude},
            error: "error retrieving posts"
          })
        });
    })      
    .catch((err) => {
      console.log(err);
      res.send({
        posts: null,
        searchLocation: {'latitude': latitude, 'longitude': longitude},
        error: "error with coordinates"
      })
    }) 
});

router.get('/findpost/:postNumber', AuthService.checkAuth, function(req, res, next) {

  var like = false;
  var postNumber = req.params.postNumber;
  var numLikesInPost = 0;

  var objForResponse = {};

  findPostByIdNumber(postNumber)
    .then((post) => {
      if (res.locals.authorised && res.locals.user && res.locals.user._id ) {
        // let's chech if the user likes this post
        var userId = res.locals.user._id;
        var index = post.usersThatLikePost.indexOf(userId);
        if (index < 0) var like = false;
        else var like = true;
      }
      numLikesInPost = post.usersThatLikePost.length;
      
      //here we remove the userID and add a username to be displayed;
      User.findById(post.user, function(err, user) {
        if (err) console.log(err);
        var username = user.username;
        objForResponse = {
          username: username,
          title: post.title,
          description: post.description,  
          location: post.location
        }
        console.log(objForResponse)

        res.json({
          post: objForResponse,
          like: like,
          numLikesInPost: numLikesInPost
        });
      })
    })
    .catch((err) => {
      console.log(err);
      res.json(err)
    });
});

function createNewPost(req, userId) {

  var post = {
    user: userId,
    title: req.body.title,
    description: req.body.description,
    location: [ req.body.longitude, req.body.latitude ],
    url: req.body.url,
    dateCreated: Date.now(),
    codeCountry:  req.body.codeCountry,
    formatedAddress:  req.body.formatedAddress
  }

  return new Promise((resolve, reject) => {
    Post.create(post, function (error, post) {
        if (error) {
          console.log(error)
          reject(error);
        } else {
          console.log({post})
          resolve(post);
        }
      });
  })

}

function findClosestsPosts(pointCoords) {

  var limit = 10;
  // get the max distance or set it to 20000000 meters (almost max)
  var maxDistance = 20000000;
  // we need to convert the distance to radians
  // the raduis of Earth is approximately 6371 kilometers
  maxDistance /= 6371;

  // get coordinates [ <longitude> , <latitude> ]
  var coords = [];
  coords[0] = pointCoords.lng;
  coords[1] = pointCoords.lat;
  console.log(coords)

  // find a location
  return new Promise((resolve, reject) => {
    Post.find({
      location: {
        $near: coords,
        $maxDistance: maxDistance
      }
    }).limit(limit).exec(function(err, posts) {
      if (err) {
        reject(err);
      }
      resolve(posts);
    });

  })
}

function findPostByIdNumber(postNumber) {

  // find a location
  return new Promise((resolve, reject) => {
    Post.findOne({
      idNumber: postNumber
    }).exec(function(err, post) {
      if (err) {
        reject(err);
      }
      console.log(post)
      resolve(post);
    });

  })
}

module.exports = router;
