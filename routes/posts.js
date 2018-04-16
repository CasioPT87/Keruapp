var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var User = require('../models/User');
var MapService = require('../services/mapService');
var AuthService = require('../services/authService');
var CommentService = require('../services/commentService');

/* GET users listing. */
router.post('/createpost', AuthService.checkAuth, function(req, res, next) {

  if (res.locals.authorised && res.locals.user) {

    var userId = res.locals.user._id;

    createNewPost(req, userId)
    .then((post) => {

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

  console.log('post /likepost')

  if (res.locals.authorised && res.locals.user) {

    var postNumber = req.body.postNumber;
    var likePost = false;
    var numLikesInPost = 0;
    var userId = res.locals.user._id;

    Post.findOne({ idNumber: postNumber }, function(err, post) {
      if (err || !post) {
        console.log('Ha habido un error buscando el post')
      } else {
        var idPost = post._id;
        var index = post.usersThatLikePost.findIndex((userThatLikePost) => {
          return userThatLikePost.toString() == userId.toString();
        })
        if (index < 0) {
          //todavia no le gusta
          console.log('1')
          var usersThatLikePost = post.usersThatLikePost;
          usersThatLikePost.push(userId);
          Post.update({ _id: post._id }, { usersThatLikePost: usersThatLikePost }, null, function(err, rawResponse) {

            numLikesInPost = usersThatLikePost.length;
            
            res.send({
              likePost: true,
              numLikesInPost: numLikesInPost
            });
          })
        } else {
          // ya le gusta
          var usersThatLikePost = post.usersThatLikePost;
          usersThatLikePost.splice(index, 1);
          Post.update({ _id: post._id }, { usersThatLikePost: usersThatLikePost }, null, function(err, rawResponse) {

            numLikesInPost = usersThatLikePost.length;
            
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

  if (address) {
    MapService.getCoordinates(address)
    .then((pointCoords) => {

      var latitude = pointCoords.lat;
      var longitude = pointCoords.lng;

      findClosestsPosts(pointCoords)
        .then((posts) => {
          // we dont want to send any user id in the response
          treatPostsToRemoveUserId(posts)
            .then((postsTreated) => {
              res.send({
                posts: postsTreated,
                searchLocation: {'latitude': latitude, 'longitude': longitude},
                errorLoadingPosts: false
              });
            })              
        })
        .catch((err) => {
          console.log(err);
          res.send({
            posts: null,
            searchLocation: {'latitude': latitude, 'longitude': longitude},
            errorLoadingPosts: err
          })
        });
    })      
    .catch((err) => {
      console.log(err);
      res.send({
        posts: null,
        searchLocation: {'latitude': latitude, 'longitude': longitude},
        errorLoadingPosts: "No han llegado las coordenadas a la aplicacion"
      })
    })
  } else if (!address) {
    res.json({
            posts: null,
            searchLocation: {'latitude': null, 'longitude': null},
            errorLoadingPosts: "Ha habido un problema encontrando las coordenadas de esa localizacion"
          });
  }
  
   
});

router.get('/findpost/:postNumber', AuthService.checkAuth, function(req, res, next) {

  console.log('post /findpost/:postNumber')

  var like = false;
  var postNumber = req.params.postNumber;
  var numLikesInPost = 0;

  var objForResponse = {};

  findPostByIdNumber(postNumber)
    .then((post) => {
      var comments = CommentService.getCommentsByPostId(post._id);
      return Promise.all([post, comments], (values) => {
        var comments = values[1];
        if (comments) return [post, comments];
        else return [post, []];
      }); 
    })
    .then((values) => {
      var post = values[0];
      var comments = values[1];

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
        objForResponsePost = {
          username: username,
          title: post.title,
          description: post.description,  
          location: post.location,
          imageURL: post.imageURL,
          codeCountry: post.codeCountry,
          formatedAddress: post.formatedAddress,
          comments: post.comments
        }

        res.json({
          post: objForResponsePost,
          comments: comments,
          like: like,
          numLikesInPost: numLikesInPost
        });
      })
    })
    .catch((err) => {
      res.json(err)
    });
});

router.get('/findlastsposts', AuthService.checkAuth, function(req, res, next) {
  
  findLastPosts()
    .then((posts) => {
      treatPostsToRemoveUserId(posts)
        .then((postsTreated) => {
          res.json({
          posts: postsTreated,
          errorLoadingPosts: false
        });
      })   
    })
    .catch((err) => {
      console.log(err);
      res.send({
        posts: null,
        errorLoadingPosts: "Ha habido un error recuperando los ultimos posts"
      })
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
    formatedAddress:  req.body.formatedAddress,
    imageURL: req.body.imageURL,
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

  var limit = 100;
  // get the max distance or set it to 20000000 meters (almost max)
  var maxDistance = 20000000;
  // we need to convert the distance to radians
  // the raduis of Earth is approximately 6371 kilometers
  maxDistance /= 6371;

  // get coordinates [ <longitude> , <latitude> ]
  var coords = [];
  coords[0] = pointCoords.lng;
  coords[1] = pointCoords.lat;

  // find a location
  return new Promise((resolve, reject) => {
    Post.find({
      location: {
        $near: coords,
        $maxDistance: maxDistance
      }
    }).limit(limit).exec(function(err, posts) {
      if (err || !posts) {
        reject(new Error('Problema recuperando los posts ordenador por cercania'));
      }
      resolve(posts);
    });

  })
}

function findLastPosts() {

  var skip = 0;
  var limit = 100;

  return new Promise((resolve, reject) => {
    Post.find({},
      null, // Columns to Return
      {
        skip: skip, // Starting Row
        limit: limit, // Ending Row
        sort:{
            dateCreated: -1 //Sort by Date Added DESC
        }
      },
      function(err, posts){
        if (err) reject(new Error(err))
        else resolve(posts); // Do something with the array of 10 objects
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
      else if (!post) reject(new Error('no hemos podido encontrar el post. Sorry!!'))
      else if (post) resolve(post);
    });
  })
}

function treatPostsToRemoveUserId(posts) {

  return new Promise((resolve, reject) => {
    var postTreated = posts.map((post) => {
      console.log(post)
      return {
        idNumber: post.idNumber,
        title: post.title,
        likes: post.usersThatLikePost.length,
        formatedAddress: post.formatedAddress,
        imageURL: post.imageURL,
        codeCountry: post.codeCountry
      }
    })
    if (postTreated) resolve(postTreated);
    if (!postTreated) reject(new Error('Problem treating the posts'));
  })

  
}

module.exports = router;
