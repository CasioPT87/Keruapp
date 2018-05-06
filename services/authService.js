
var User = require('../models/User');
  
function checkAuth(req, res, next) {

  console.log('authService checkAuth')

  res.locals = { authorised: false, user: null };

	getUser(req)
	  .then((response) => {
      var user = response[0];
      var methodIden = response[1];
	  	res.locals.authorised = !!user;
	  	res.locals.user = user;
      res.locals.methodIdentification = methodIden;
	  	next();
	  })
	  .catch((err) => {
	  	console.log(err)
      //we write again. useless but just to be clear:
      res.locals.authorised = false;
      res.locals.user = null;
      res.locals.methodIdentification = err;
	  	next();
	  })
}

function getUser(req) {
  var userId = null;
  var methodIden = null;
  //if (req.user && req.user.authenticated && req.user.id) userId = req.user.id;

  console.log(!!req.session, !!req.session.userId, !!req.session.passport)

  if (req.session && req.session.userId) {
    userId = req.session.userId;
    methodIden = 'password';
    console.log(methodIden)
  } else if (req.session && req.session.passport && req.session.passport.user) {
    userId = req.session.passport.user;
    methodIden = 'google';
    console.log(methodIden)
  }

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
        	resolve([user, methodIden]);
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