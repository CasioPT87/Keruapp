'use strict'

var PostService = require('../services/postService');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',     
      required: true, //change this
    },
    idNumber: {
    	type: Number,
    	required: true,
    	default: 0,
      unique: true
    },
    title: String,
    description: String,
    codeCountry: String,
    formatedAddress: String,
    location: {
      type: [Number],  // [<longitude>, <latitude>]
      index: '2d'      // create the geospatial index
	  },
    imageURL: String,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    usersThatLikePost: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dateCreated: Date,
    dateModified: Date
});

//this is the model
var post = mongoose.model('Post', PostSchema);

PostSchema.pre('save', function (next) {

  new Promise((resolve, reject) => {
    var lastIdNumberInPosts = PostService.lastIdNumberInPosts(post);
    resolve(lastIdNumberInPosts);
    })
    .then((lastIdNumberInPosts) => {
      console.log(lastIdNumberInPosts)
      var newIdNumber = Number(lastIdNumberInPosts) + 1;
      console.log(newIdNumber)
      this.idNumber = newIdNumber;
      next();
    })
    .catch((err) => {
      console.log(err)
      throw new Error(err);
      next();
    })

  // // Only increment when the document is new
  // if (this.isNew) {
  //   Post.count().then(res => {
  //     this.idNumber = res; // Increment count
  //     next();
  //   });
  // } else {
  //   next();
  // }


});

module.exports = post;

