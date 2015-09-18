var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;
// var hub = require('../config/hub');
/**
* Каждую секунду работы сервера пишем в монгу текущее серверное время
* и всего время работы запущенного сервера (время жизни мира)
*/
module.exports = function () {
    timeSettings.getTime(function (err, curTime) {
        if (err) {
            log.err(err);
            console.log(err);
        }
        var firstDelta = Date.now() - curTime.lastServerTime;
        var mainTimer = function () {
            timeSettings.setTime(firstDelta, function (err) {
                if (err) {
                    log.err(err);
                    console.log(err);
                }
                firstDelta = 0;
                setTimeout(mainTimer, 1000);
            });
        };
        mainTimer();
    });
};