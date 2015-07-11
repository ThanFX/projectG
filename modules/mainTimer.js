var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;

module.exports = function(){
    timeSettings.getTime(function(err, curTime){
        if(err){
            log.err(err);
        }
        var deltaTime = Date.now() - curTime.lastWorldTime;
        var mainTimer = function() {
            timeSettings.setTime(Date.now(), deltaTime, function(err, curTime){
                if(err){
                    log.err(err);
                }
                setTimeout(mainTimer, 1000);
            });
        };
        mainTimer();
    });
};