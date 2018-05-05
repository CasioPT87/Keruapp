'use strict'

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
//const arrayUniquePlugin = require('mongoose-unique-array');

var UserSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true // this is taking care of the white spaces
    },
    password: {
      type: String,
      required: false, // because we dont get a passport when we log with OAuth
    },
    googleId: {
      type: String,
      required: false,
    },
    description: String,
    url: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    favoriteUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dateCreated: Date,
    dateModified: Date,
    imageURL: {
      type: String,
      default: ""
    },
    language: {
      type: String,
      default: ""
    }  
  });

  //authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      //compara los passwords y si todo va bien llama el callback con el user de la db
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  if (user.password) {
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  } else {
    next();
  }
});

//UserSchema.plugin(arrayUniquePlugin);

  
var User = mongoose.model('User', UserSchema);
module.exports = User;

