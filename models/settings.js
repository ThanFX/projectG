var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var async = require('async');
var Schema = mongoose.Schema;

var schema = new Schema({
    settingType: String,
    value: String
});

schema.statics.setTime = function(newTime, callback){
    var Settings = this;
    Settings.findOne({settingType:"time"}, function(err, curTime){
        if(err) {
            log.err(err);
            callback(err);
        }
        if(!curTime) {
            curTime = new Settings({settingType:"time", value:null});
        }
        curTime.value = newTime;
        curTime.save(function(err){
            if(err) {
                log.err(err);
                callback(err);
            }
            callback(null, curTime.value);
        });
    });
};

schema.statics.getTime = function(callback){
    this.findOne({settingType:"time"}, function(err, curTime) {
        if (err) {
            log.err(err);
            callback(err);
        }
        callback(null, curTime);
    });
};

exports.Settings = mongoose.model('settings', schema);