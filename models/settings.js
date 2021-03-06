'use strict';
var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Chunks = require('../models/chunk').Chunks;
var hub = require('../config/hub');
var Schema = mongoose.Schema;

var timeSchema = new Schema({
    settingType: String,
    lastServerTime: String,
    lastWorldTime: String
});

var configSchema = new Schema({
    settingType: String,
    checkPeriods: Schema.Types.Mixed,
    calendar: Schema.Types.Mixed,
    changeSpeed: Schema.Types.Mixed,
    worldTimeSpeedKoef: String
});

var worldMapSchema = new Schema({
    settingType: String,
    worldMap: []
});

var skillsSchema = new Schema({
    settingType: String,
    skills: [{
        name: String,
        title: String,
        isJob: Boolean,
        isPeriodic: Boolean,
        periodInMinutes: Number,
        needLocation: Boolean,
        locations: [],
        minValue: Number,
        maxValue: Number
    }]
});

skillsSchema.statics.getSkills = (callback) => {
    let SkillsSettings = mongoose.model('skillsSettings', skillsSchema, 'settings');
    SkillsSettings.findOne({settingType: 'skills'}, (err, skills) => {
        if (err) {
            console.log(err);
            callback(err);
        }
        callback(null, skills.skills);
    });
};

skillsSchema.statics.addOrUpdateSkill = (skill, callback) => {
    let SkillsSettings = mongoose.model('skillsSettings', skillsSchema, 'settings');
    SkillsSettings.findOne({settingType: 'skills'}, (err, skills) => {
        if (err) {
            console.log(err);
            callback(err);
        }
        let isExist = false;
        if (!skills) {
            skills = new SkillsSettings({settingType: 'skills', skills: []});
        }
        for (let i = 0; i < skills.length; i++) {
            if (skills.skills[i].name == skill.name) {
                for (let key in skill) {
                    if (!skill.hasOwnProperty(key)) {
                        continue;
                    }
                    skills.skills[i][key] = skill[key];
                }
                isExist = true;
            }
            if (isExist) {
                break;
            }
        }
        if (!isExist) {
            skills.skills.push(skill);
        }
        skills.save((err) => {
            if (err) {
                console.log(err);
                callback(err);
            }
            callback(null);
        });
    });
};

worldMapSchema.statics.getWorldMapAll = function (callback) {
    let worldMapSettings = mongoose.model('worldMap', worldMapSchema, 'settings');
    worldMapSettings.findOne({settingType: 'world'}, function (err, worldMap) {
        if (err) {
            log.error(err);
            callback(err);
        }
        callback(null, worldMap.worldMap);
    });
};

worldMapSchema.statics.setWorldMapAll = function (worldMap, callback) {
    let WorldMapSettings = mongoose.model('worldMap', worldMapSchema, 'settings');
    WorldMapSettings.findOne({settingType: 'world'}, function (err, wm) {
        if (err) {
            log.error(err);
            callback(err);
        }
        if (!wm) {
            wm = new WorldMapSettings({settingType: 'world'});
        }
        wm.worldMap = worldMap;
        wm.markModified('worldMap');
        wm.save(function (err) {
            if (err) {
                log.error(err);
                callback(err);
            }
            callback(null, wm.worldMap);
        });
    });
};

/* Функция, заполняющая worldMap из коллекции чанков*/
worldMapSchema.statics.synchronizeWorld = function (callback) {
    let worldMapSettings = mongoose.model('worldMap', worldMapSchema, 'settings');
    worldMapSettings.getWorldMapAll(function (err, wm) {
        if (err) {
            console.log(err);
        } else {
            Chunks.find('*', function (err, chunks) {
                if (err) {
                    console.log(err);
                } else {
                    wm.forEach(function (wmItem, i, wm) {
                        // Дибильно, но время уже половина первого ночи и не думается :) При разрастании карты необходим глубокий рефакторинг!
                        for (var j = 0; j < chunks.length; j++) {
                            if (wmItem.x == chunks[j].x && wmItem.y == chunks[j].y) {
                                if (chunks[j].isExplored == true) {
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
                    worldMapSettings.setWorldMapAll(wm, function (err) {
                        if (err) {
                            console.log(err);
                            callback(err);
                        } else {
                            console.log('OK!');
                            callback(null);
                        }
                    });
                }
            });
        }
    });
};

timeSchema.statics.setTime = function (firstDelta, callback) {
    let configSettings = mongoose.model('configSettings', configSchema, 'settings');
    let TimeSettings = mongoose.model('timeSettings', timeSchema, 'settings');
    configSettings.getConfig(function (err, config) {
        if (err) {
            log.error(err);
            callback(err);
        }
        if (!config) {
            log.error('Ошибка загрузки конфигурации');
            callback(null);
        }
        TimeSettings.findOne({settingType: 'time'}, function (err, curTime) {
            if (err) {
                log.error(err);
                callback(err);
            }
            if (!curTime) {
                curTime = new TimeSettings({settingType: 'time'});
            }

            var nowTime = Date.now();
            var deltaTime = (nowTime - curTime.lastServerTime) - firstDelta;
            var deltaWorldTime = Math.floor(deltaTime * config.worldTimeSpeedKoef);
            curTime.lastWorldTime = +curTime.lastWorldTime + deltaWorldTime;
            hub.time = convertTimeToDate(curTime.lastWorldTime, config.calendar);
            curTime.lastServerTime = nowTime;
            curTime.save(function (err) {
                if (err) {
                    log.error(err);
                    callback(err);
                }
                callback(null, curTime);
            });
        });
    });
};

timeSchema.statics.getTime = function (callback) {
    let timeSettings = mongoose.model('timeSettings', timeSchema, 'settings');
    timeSettings.findOne({settingType: 'time'}, function (err, curTime) {
        if (err) {
            log.error(err);
            callback(err);
        }
        callback(null, curTime);
    });
};

configSchema.statics.setConfig = function (parameters, callback) {
    let ConfigSettings = mongoose.model('configSettings', configSchema, 'settings');
    ConfigSettings.findOne({settingType: 'config'}, function (err, curConfig) {
        if (err) {
            log.error(err);
            callback(err);
        }
        if (!curConfig) {
            curConfig = new ConfigSettings({settingType: 'config'});
        }
        curConfig.calendar = parameters.calendar;
        curConfig.checkPeriods = parameters.checkPeriods;
        console.log(curConfig);
        curConfig.markModified('calendar');
        curConfig.markModified('checkPeriods');
        curConfig.save(function (err) {
            if (err) {
                log.error(err);
                callback(err);
            }
            callback(null, curConfig);
        });
    });
};

configSchema.statics.getConfig = function (callback) {
    let configSettings = mongoose.model('configSettings', configSchema, 'settings');
    configSettings.findOne({settingType: 'config'}, function (err, curConfig) {
        if (err) {
            log.error(err);
            callback(err);
        }
        callback(null, curConfig);
    });
};

/* Рассчитываем нормальное календарное время мира
*
*/
timeSchema.statics.getWorldTime = function (callback) {
    let configSettings = mongoose.model('configSettings', configSchema, 'settings');
    let timeSettings = mongoose.model('timeSettings', timeSchema, 'settings');
    configSettings.getConfig(function (err, config) {
        if (err) {
            log.error(err);
            callback(err);
        }
        if (!config) {
            log.error('Ошибка загрузки конфигурации');
            callback(null);
        }
        // Читаем конфиг календаря
        timeSettings.getTime(function (err, curTime) {
            if (err) {
                log.error(err);
                callback(err);
            }
            if (!curTime) {
                log.error('Ошибка загрузки времени');
                callback(null);
            }
            callback(null, convertTimeToDate(curTime.lastWorldTime, config.calendar));
        });
    });
};

function convertTimeToDate (time, calendar) {
    // Пересчитываем количество 'реальных' милисекунд жизни мира
    // в виртуальные секунды относительно коэффициента календаря.
    var worldSeconds = (time * calendar.worldCalendarKoef) / 1000;
    // let sec = worldSeconds;
    var worldTime = {};
    var periods = calendar.periods;
    // Сортируем массив периодов календаря по убыванию количества секунд в периоде
    periods.sort((elem1, elem2) => {
        return elem2.timeInSeconds - elem1.timeInSeconds;
    });
    // Получаем нормальные дату и время исходя из конфигурации календаря
    // Для года, месяца, декады и дня нет нулевых значений, они начинаются с единицы, но максимальное на 1 больше
    periods.forEach((period, i, periods) => {
        if (period.timeInSeconds > worldSeconds) {
            worldTime[period.periodLabel] = 0 + period.minValue;
        } else {
            worldTime[period.periodLabel] = Math.floor(worldSeconds / period.timeInSeconds);
            worldSeconds -= (worldTime[period.periodLabel] * period.timeInSeconds);
            worldTime[period.periodLabel] += +period.minValue;
        }
    });
    worldTime.milliseconds = time;
    return worldTime;
}

exports.timeSettings = mongoose.model('timeSettings', timeSchema, 'settings');
exports.configSettings = mongoose.model('configSettings', configSchema, 'settings');
exports.worldMap = mongoose.model('worldMap', worldMapSchema, 'settings');
exports.skillsSettings = mongoose.model('skillsSettings', skillsSchema, 'settings');
