var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var async = require('async');
var Schema = mongoose.Schema;

var timeSchema = new Schema({
    settingType: String,
    lastServerTime: String,
    lastWorldTime: String
});

var configSchema = new Schema({
    settingType: String,
    params: Schema.Types.Mixed
});

timeSchema.statics.setTime = function(newTime, deltaTime, callback){
    var timeSettings = this;
    timeSettings.findOne({settingType:"time"}, function(err, curTime){
        if(err) {
            log.err(err);
            callback(err);
        }
        if(!curTime) {
            curTime = new timeSettings({settingType:"time"});
        }
        curTime.lastServerTime = newTime;
        curTime.lastWorldTime = newTime - deltaTime;
        curTime.save(function(err){
            if(err) {
                log.err(err);
                callback(err);
            }
            callback(null, curTime);
        });
    });
};

timeSchema.statics.getTime = function(callback){
    var timeSettings = this;
    timeSettings.findOne({settingType:"time"}, function(err, curTime) {
        if (err) {
            log.err(err);
            callback(err);
        }
        callback(null, curTime);
    });
};

configSchema.statics.setConfig = function(params, callback){
    var configSettings = this;
    configSettings.findOne({settingType:"config"}, function(err, curConfig){
        if(err) {
            log.err(err);
            callback(err);
        }
        if(!curConfig) {
            curConfig = new configSettings({settingType:"config"});
        }
        curConfig.params = params;
        console.log(curConfig);
        curConfig.markModified('params');
        curConfig.save(function(err){
            if(err) {
                log.err(err);
                callback(err);
            }
            callback(null, curConfig);
        });
    });
};

configSchema.statics.getConfig = function(callback){
    var configSettings = this;
    configSettings.findOne({settingType:"config"}, function(err, curConfig) {
        if (err) {
            log.err(err);
            callback(err);
        }
        callback(null, curConfig);
    });
};

exports.timeSettings = mongoose.model('timeSettings', timeSchema, 'settings');
exports.configSettings = mongoose.model('configSettings', configSchema, 'settings');