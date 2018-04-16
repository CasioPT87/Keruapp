

var Comment = require('../models/Comment');
var User = require('../models/User');
var DateService = require('../services/dateService');

function getCommentsByPostId(post_id) {
	return new Promise((resolve, reject) => {
		//Now we get all the comments of the post
	  Comment.find( { post: post_id }, function(err, comments) {
      if (err) { 
      	reject(new Error('error recuperando comentarios del post'));
      }
      if (!comments) resolve([]);
      if (comments) {
        treatComments(comments)
          .then((commentsTreated) => {
            resolve(commentsTreated);
          })
          .catch((err) => {
            reject(new Error('error tratando comentarios del post'))
          }) 
      }
		});
	})		
}

function treatComments(comments) {
  
  var arrayOfTreatedComments = comments.map((thisComment) => {

    var thisUserId = thisComment.user; 
    return new Promise((resolve, reject) => {
       
      User.findById(thisUserId, null, function(err, user) {          
        if (err) {
          console.log(err)
          resolve({username: null}); 
        }
        else if (!user) resolve({username: null});
        else if (user) {            
          resolve({
          username: user.username,
          dateCreated: DateService.formatAddress(thisComment.dateCreated),
          text: thisComment.text
          });
        }              
      })
    })
  })

  return Promise.all(arrayOfTreatedComments); 
}

module.exports = {
  getCommentsByPostId,
  treatComments
};