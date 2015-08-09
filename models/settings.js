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

timeSchema.statics.setTime = function(firstDelta, callback){
    var timeSettings = this;
    configSettings = mongoose.model('configSettings', configSchema, 'settings');
    configSettings.getConfig(function(err, config) {
        if (err) {
            log.err(err);
            callback(err);
        }
        if (!config) {
            log.err("Ошибка загрузки конфигурации");
            callback(null);
        }
        timeSettings.findOne({settingType: "time"}, function (err, curTime) {
            if (err) {
                log.err(err);
                callback(err);
            }
            if (!curTime) {
                curTime = new timeSettings({settingType: "time"});
            }

            var nowTime = Date.now();
            var deltaTime = (nowTime - curTime.lastServerTime) - firstDelta;
            var deltaWorldTime = deltaTime * config.params.worldTimeSpeedKoef;
            curTime.lastWorldTime = +curTime.lastWorldTime + deltaWorldTime;

            curTime.lastServerTime = nowTime;
            curTime.save(function (err) {
                if (err) {
                    log.err(err);
                    callback(err);
                }
                callback(null, curTime);
            });
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
/* Рассчитываем нормальное календарное время мира
*
*/
timeSchema.statics.getWorldTime = function(callback){
    var timeSettings = this;
    configSettings = mongoose.model('configSettings', configSchema, 'settings');
    configSettings.getConfig(function(err, config){
        if(err){
            log.err(err);
            callback(err);
        }
        if(!config){
            log.err("Ошибка загрузки конфигурации");
            callback(null);
        }
        // Читаем конфиг календаря
        timeSettings.getTime(function(err, curTime){
            if(err){
                log.err(err);
                callback(err);
            }
            if(!curTime){
                log.err("Ошибка загрузки времени");
                callback(null);
            }
            // Пересчитываем количество "реальных" милисекунд жизни мира в виртуальные секунды относительно коэффициента календаря.
            var worldSeconds = (curTime.lastWorldTime * config.params.calendar.worldCalendarKoef) / 1000;
            var sec = worldSeconds;
            var worldTime = {};
            var periods = config.params.calendar.periods;
            //Сортируем массив периодов календаря по убыванию количества секунд в периоде
            periods.sort(function(elem1, elem2){
                return elem2.timeInSeconds - elem1.timeInSeconds;
            });
            //Получаем нормальные дату и время исходя из конфигурации календаря
            // Для месяца, декады и дня нет нулевых значений, они начинаются с единицы, но максимальное на 1 больше
            periods.forEach(function(period, i, periods){
                if(period.timeInSeconds > sec) {
                    worldTime[period.periodLabel] = 0 + +period.minValue;
                } else {
                    worldTime[period.periodLabel] = Math.floor(sec / period.timeInSeconds);
                    sec = sec - (worldTime[period.periodLabel] * period.timeInSeconds);
                    worldTime[period.periodLabel] += +period.minValue;
                }
            });
            worldTime.milliseconds = curTime.lastWorldTime;
            callback(null, worldTime);
        });
    });
};

exports.timeSettings = mongoose.model('timeSettings', timeSchema, 'settings');
exports.configSettings = mongoose.model('configSettings', configSchema, 'settings');