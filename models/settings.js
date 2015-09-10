var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Chunks = require('../models/chunk').Chunks;
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

var worldMapSchema = new Schema({
    settingType: String,
    worldMap: []
});

worldMapSchema.statics.getWorldMapAll = function(callback){
    var worldMapSettings = this;
    worldMapSettings.findOne({settingType:"world"}, function(err, worldMap) {
        if (err) {
            log.err(err);
            callback(err);
        }
        callback(null, worldMap.worldMap);
    });
};

worldMapSchema.statics.setWorldMapAll = function(worldMap, callback){
    var worldMapSettings = this;
    worldMapSettings.findOne({settingType: "world"}, function(err, wm){
        if(err){
            log.error(err);
            callback(err);
        }
        if(!wm) {
            wm = new worldMapSettings({settingType: "world"});
        }
        wm.worldMap = worldMap;
        wm.markModified('worldMap');
        wm.save(function(err){
            if(err){
                log.err(err);
                callback(err);
            }
            callback(null, wm.worldMap);
        });
    });
};

/* Функция, заполняющая worldMap из коллекции чанков*/
worldMapSchema.statics.synchronizeWorld = function(callback){
    this.getWorldMapAll(function(err, wm){
        if(err){
            console.log(err);
        } else {
            Chunks.find('*', function(err, chunks){
                if(err){
                    console.log(err);
                } else {
                    wm.forEach(function(wmItem, i, wm){
                        // Дибильно, но время уже половина первого ночи и не думается :) При разрастании карты необходим глубокий рефакторинг!
                        for(var j = 0; j < chunks.length; j++){
                            if(wmItem.x == chunks[j].x && wmItem.y == chunks[j].y) {
                                if(chunks[j].isExplored == true) {
                                    wmItem.isExplored = true;
                                    wmItem.chunkId = chunks[j]._id;
                                } else {
                                    wmItem.isExplored = false;
                                    wmItem.chunkId = null;
                                }
                                console.log(wmItem);
                            }
                        }
                    });
                    WorldMap.setWorldMapAll(wm, function(err){
                        if(err){
                            console.log(err);
                        } else{
                            console.log("OK!");
                        }
                    });
                }
            });
        }
    });
};

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
        timeSettings.findOne({settingType: 'time'}, function (err, curTime) {
            if (err) {
                log.err(err);
                callback(err);
            }
            if (!curTime) {
                curTime = new timeSettings({settingType: "time"});
            }

            var nowTime = Date.now();
            var deltaTime = (nowTime - curTime.lastServerTime) - firstDelta;
            var deltaWorldTime = Math.floor(deltaTime * config.params.worldTimeSpeedKoef);
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
            // Для года, месяца, декады и дня нет нулевых значений, они начинаются с единицы, но максимальное на 1 больше
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
exports.worldMap = mongoose.model('worldMap', worldMapSchema, 'settings');