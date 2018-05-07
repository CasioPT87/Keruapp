var express = require('express');
var router = express.Router();
var MapService = require('../services/mapService');

//coordenadas de los cagnos de meca
const defaultCoord = {
  lat: 50.5937982,
  lng: -1.2153982
}

/* GET users listing. */
router.get('/:address', function(req, res, next) {

	var address = req.sanitize(req.params.address);
  MapService.getCoordinates(address)
    .then((result) => {
      console.log(result)
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.json(defaultCoord)
    })
});

// router.post('/createuser', function(req, res, next) {

// 	console.log(req.body)
  
//     if ( req.body.username && req.body.password){
     
//       var user = {
//         username: req.body.username,
//         password: req.body.password,
//         description: req.body.description,
//         url: req.body.url   
//       }
  
//       User.create(user, function (error, user) {
//         if (error) {
//           console.log(error)
//           return next(error);
//         } else {
//           return res.json(user);
//         }
//       });
  
//     } else {
//       res.send('algo has hecho mal salvando al user, babe')
//     }
// });

module.exports = router;
