'use strict'

var mongoose = require('mongoose');

var HeroSchema = new mongoose.Schema({
    name: String,
    id: String 
      
});
  
var Hero = mongoose.model('Hero', HeroSchema);
module.exports = Hero;

