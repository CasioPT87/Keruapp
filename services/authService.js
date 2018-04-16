
var User = require('../models/User');
  
function checkAuth(req, res, next) {

  console.log('authService checkAuth')

  res.locals = { authorised: false, user: null };

	getUser(req)
	  .then((user) => {
	  	res.locals.authorised = !!user;
	  	res.locals.user = user;
	  	next();
	  })
	  .catch((err) => {
	  	console.log(err)
      //we write again. useless but just to be clear:
      res.locals.authorised = false;
      res.locals.user = null;
	  	next();
	  })
}

function getUser(req) {
  var userId = null;
  if (req.user && req.user.authenticated && req.user.id) userId = req.user.id;
  if (req.session && req.session.userId) userId = req.session.userId; 

  return new Promise((resolve, reject) => {

  	if (userId) {
  		User.findById( userId, function (err, user) {
        if (err) {
        	reject(err)
        }
        if (!user) {
        	reject(new Error('No user found'));
        }
        if (user) {
        	resolve(user);
        }
      });
 	  } else if (!userId) {
 	    reject(new Error('No userId found'))
 	  }
  })
}

module.exports = {
	checkAuth
};