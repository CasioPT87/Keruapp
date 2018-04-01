
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

module.exports = {
	checkAuth
};