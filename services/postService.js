
var Post = require('../models/Post');
  
function addLike(req, res, next) {

	getUser(req)
	  .then((user) => {
	  	console.log('user')
	  	res.locals.authorised = !!user;
	  	res.locals.user = user;
	  	console.log('hey joe')
	  	next();
	  })
	  .catch((err) => {
	  	console.log(err)
	  	next();
	  })
}

function getUser(req) {

  var userId = null;
  if (req.user && req.user.authenticated && req.user.id) {userId = req.user.id; console.log('1'); console.log(req.user)}
  if (req.session && req.session.userId) userId = req.session.userId; {console.log('2'); console.log(req.session)}
  console.log(userId)

  return new Promise((resolve, reject) => {

  	if (userId) {
  		User.findById( userId, function (err, user) {
        if (err) {
        	reject(err)
        }
        if (!user) {
        	reject(new Error('No user found'))
        }
        if (user) {
        	resolve(user);
        }
      });
 	  } else if (!userId) {
 	    resolve(null)
 	  }
  })
}

function lastIdNumberInPosts(post) {

  return new Promise((resolve, reject) => {
    post.findOne({ })
    .sort('-idNumber')  // give me the max
    .exec(function (err, lastPost) {
      if (err) {
        console.log(err)
        reject(new Error('error encontrando el ultimo post'));
      } else {
        resolve(lastPost.idNumber);
      }
    });
  });  
}

// vamos a usar esto para el update de los posts, de momento no hay update, asi que nada...para cuando lo haya
function checkIfPostExists(post, idNumberNew) {
  console.log(idNumberNew)
  return new Promise((resolve, reject) => {
    post.find({ idNumber: idNumberNew }, function (err, posts) {
      if (err) {
        console.log(err)
        reject( new Error('error encontrando si el post ya existia') );
      } else {
        console.log(posts);
        if (posts.length <= 0) resolve(false);
        else if (posts.length > 0) resolve(true);
        else reject( new Error('error encontrando si el post ya existia: posts no es un array') );
      }
    });

  })
}

module.exports = {
	addLike: addLike,
  getUser: getUser,
  checkIfPostExists: checkIfPostExists,
  lastIdNumberInPosts: lastIdNumberInPosts
};