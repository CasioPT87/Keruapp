
var User = require('../models/User');
  
function checkAuth(req, res, next) {

  console.log('checking auth')

  res.locals = { authorised: false, user: null };

	getUser(req)
	  .then((user) => {
	  	res.locals.authorised = !!user;
	  	res.locals.user = user;
	  	next();
	  })
	  .catch((err) => {
	  	console.log(err)
	  	next();
	  })
}

function getUser(req) {

  var userId = null;
  if (req.user && req.user.authenticated && req.user.id) userId = req.user.id;
  if (req.session && req.session.userId) userId = req.session.userId; 
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