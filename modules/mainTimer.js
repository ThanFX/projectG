var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;

/**
* Каждую секунду работы сервера пишем в монгу текущее серверное время 
* и всего время работы запущенного сервера (время жизни мира) 
*/
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