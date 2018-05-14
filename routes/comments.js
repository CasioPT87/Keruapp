var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment');
var Post = require('../models/Post');
var User = require('../models/User');
var AuthService = require('../services/authService');
var CommentService = require('../services/commentService');
var CommentService = require('../services/commentService');
var StringLengthService = require('../services/stringLengthService');


router.post('/addcomment', AuthService.checkAuth, function(req, res, next) {

  if (res.locals.authorised && res.locals.user && res.locals.user._id ) {
    var userId = res.locals.user._id; // el user id del cliente, no del autor del post
    var commentString = req.sanitize(req.body.comment);
    var postNumber = req.sanitize(req.body.postNumber);

    var commentString = StringLengthService.stringLenghtControl(commentString, 500);
    
    Post.findOne({idNumber: postNumber}).exec(function(err, post) {
      if (err) {
        console.log(err)
        res.send(null);
      }   
      else if (!post) res.send(null);
      else if (post) {
        //Now we can create our new comment
        var comment = { 
          user: userId,
          post: post._id,
          text: commentString,
          dateCreated: Date.now()
        }
        Comment.create(comment, function (err, comment) {
          if (err) {
            console.log(err)
            res.send(null);
          }
          else if (!comment) res.send(null);
          else if (comment) {
            Comment.find({ post: post._id }, function(err, comments) {
              if (err) {
                console.log(err)
                res.send(null);
              }
              else if (!comments) res.send(null);
              else if (comments) {
                CommentService.treatComments(comments)
                  .then((treatedComments) => {
                    res.json(treatedComments);
                  });       
              }                                         
            });
          }            
        });
      }
    })
  }
  else {
    console.log('user is not authorised!!!');
    res.send(null);
  }
});

module.exports = router;
