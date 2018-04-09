

 var Comment = require('../models/Comment');

function getCommentsByPostId(post_id) {
	console.log('post_id : ', post_id)
	return new Promise((resolve, reject) => {
		//Now we get all the comments of the post
	  Comment.find( { post: post_id }, function(err, comments) {
      if (err) { 
      	reject(new Error('error recuperando comentarios del post'));
      }
      console.log(comments)
      if (!comments) resolve([]);
      if (comments) resolve(comments);
		});
	})		
}

module.exports = {
  getCommentsByPostId
};