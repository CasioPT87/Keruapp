var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment');
var Post = require('../models/Post');
var User = require('../models/User');
var AuthService = require('../services/authService');


router.post('/addcomment', AuthService.checkAuth, function(req, res, next) {

  if (res.locals.authorised && res.locals.user && res.locals.user._id ) {
    var userId = res.locals.user._id; // el user id del cliente, no del autor del post
    var commentString = req.body.comment;
    var postNumber = req.body.postNumber;
    
    Post.findOne({idNumber: postNumber}).exec(function(err, post) {
      if (err) {
        res.send(err)
      }      
      //Now we can create our new comment
      console.log(post)
      var comment = { 
        user: userId,
        post: post._id,
        text: commentString,
        dateCreated: Date.now()
      }
      Comment.create(comment, function (error, comment) {
        if (error) {
          console.log(error)
          return next(error);
        }
        //Now we get all the comments of the post
        Comment.find({ post: post._id }, function(err, comments) {
          res.json(comments)
        })            
    });   
  });
  }
  else {
    console.log('user is not authorised!!!')
  }
});

module.exports = router;
