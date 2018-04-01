
var express = require('express');
var router = express.Router();
var Hero = require('../models/Hero')
//var AuthsController = require('../controllers/AuthsController');

//POST route to create and save
router.post('/create', function (req, res, next) {

    console.log(req.body)
  
    if ( req.body.name && req.body.id){

      console.log('y aqui hemos llegado??')

      var name = req.body.name;
      var id = req.body.id;
     
      var hero = {
        name: name,
        id: id       
      }
  
      Hero.create(hero, function (error, hero) {
        if (error) {
          console.log('error')
          console.log(error)
          return next(error);
        } else {
          return res.json(hero);
        }
      });
  
    } else {
      res.send('algo has hecho mal salvando al hero, babe')
    }
  })

//retrieve a hero by name
router.get('/findByName/:name', function (req, res, next) {
  
    if ( req.params.name ){

      var name = req.params.name;
       
      Hero.findOne({ name: name })
        .exec(function (err, hero) {
          if (err) {
            console.log(err)
            return callback(err)
          } else if (hero) {
            res.send([hero]);
          }
        })
  
    } else {
      res.send('algo has hecho mal getting el hero, babe')
    }
  })

module.exports = router;
