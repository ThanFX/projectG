var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var async = require('async');
var Schema = mongoose.Schema;

var schema = new Schema();

schema.statics.setTime = function(time, callback){

};

exports.Settings = mongoose.model('settings', schema);