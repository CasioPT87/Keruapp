'use strict'

var path = require("path");
var fs = require("fs");
var PruebaModel = require('../models/User');

function index(req, res, next) {
    res.render('index');
}

module.exports = {
    index
}