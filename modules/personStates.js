var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;
var configSettings = require('../models/settings').configSettings;
//var Person = require('../models/person').Person;
var Chars = require('../models/person.characteristic').PersonCh;
var config = require('../config/index.js');
var async = require('async');
var Agenda = require('agenda');

module.exports = function(cb) {
    var agenda = new Agenda({db: { address: config.get('mongoose:uri')}});

    agenda.cancel({name: 'changeHTS'}, function(){
        console.log('Отменили старое задание changeHTS');
    });
    agenda.cancel({name: 'changePersonState'}, function(){
        console.log('Отменили старое задание changePersonState');
    });
    agenda.cancel({name: 'getEatAndDrink'}, function(){
        console.log('Отменили старое задание getEatAndDrink');
    });

    configSettings.getConfig(function (err, curConfig) {
        if (err) {
            log.error(err);
            console.log(err);
            cb(err);
        }

        function updatePersons(query, doc, options, callback){
            Chars.update(query, doc, options, function(err, row){
                if(err) {
                    return callback(err);
                } else {
                    console.log(row);
                    callback(null, row);
                }
            });
        }

        // Грязный хак, 5000 миллисекунд мира в одной минуте
        var worldMinute = 5000;

        var options = {
            multi: true
        };

        var checkStatePeriod = Math.floor((+curConfig.params.checkPeriods.checkStatesEveryMinutes * 60) /
                            (+curConfig.params.worldTimeSpeedKoef * +curConfig.params.calendar.worldCalendarKoef));

        var checkHTSPeriod = Math.floor((+curConfig.params.checkPeriods.checkHTSEveryMinutes * 60) /
        (+curConfig.params.worldTimeSpeedKoef * +curConfig.params.calendar.worldCalendarKoef));

        var checkEatDrinkPeriod = Math.floor((+curConfig.params.checkPeriods.checkEatDrinkEveryMinutes * 60) /
        (+curConfig.params.worldTimeSpeedKoef * +curConfig.params.calendar.worldCalendarKoef));

        var agendaCheckStatePeriod = checkStatePeriod + ' seconds';
        var agendaCheckHTSPeriod = checkHTSPeriod + ' seconds';
        var agendaCheckEatDrinkPeriod = checkEatDrinkPeriod + ' seconds';

        console.log('Проверка состояний должна запускаться каждые ' + agendaCheckStatePeriod);
        console.log('Проверка жизненных характеристик должна запускаться каждые ' + agendaCheckHTSPeriod);
        console.log('Проверка на кормление и поение должна запускаться каждые ' + agendaCheckEatDrinkPeriod);

        /* Обновляем жизненные характеристики персонажей - голод, жажду и сонливость. Сейчас захардкожены следующие коэффициенты (в час):
         *      голод: +0,5 во сне, +1 при бодрствовании
         *      жажда: +1 всегда
         *      сонливость: -4 во сне, +2 при бодрствовании
         * При изменении показателей берем только тех персонажей, у которых с момента последнего изменения прошло от 1 до 2 часов.
         * Если больше 2 часов - трогаем ToDo! Написать отдельную проверку на них и прогонять при запуске сервера!
         * ToDo!!!! Вынести все параметры отсюда в отдельный конфиг в базу!!!
         */

        agenda.define('changeHTS',
            function(job, done){
                timeSettings.getWorldTime(function(err, worldTime){
                    if(err){
                        console.log(err);
                        log.error(err);
                        cb(err);
                    }

                    // Берем персонажей, у которых последнее обновление характеристик было не менее часа и не более 2 часов назад
                    var periodStart = +worldTime.milliseconds - (worldMinute * 120);
                    var periodEnd = +worldTime.milliseconds - (worldMinute * 55);

                    var HTSFirstSleepQuery = {
                        $and: [
                            {
                                "item.lastChangeHTSTime": {
                                    $lte: periodEnd
                                }
                            },
                            {
                                "item.lastChangeHTSTime": {
                                    $gt: periodStart
                                }
                            },
                            {
                                state: 'sleep'
                            },
                            {
                                "item.somnolency.value": {
                                    $lt: 4.0
                                }
                            }
                        ]
                    };
                    var HTSFirstSleepUpdate = {
                        "item.lastChangeHTSTime": +worldTime.milliseconds,
                        $inc: {
                            "item.hunger.value": 0.5,
                            "item.thirst.value": 1.0
                        },
                        $set: {
                            "item.somnolency.value": 0.0
                        }
                    };
                    var HTSSecondSleepQuery = {
                        $and: [
                            {
                                "item.lastChangeHTSTime": {
                                    $lte: periodEnd
                                }
                            },
                            {
                                "item.lastChangeHTSTime": {
                                    $gt: periodStart
                                }
                            },
                            {
                                state: 'sleep'
                            },
                            {
                                "item.somnolency.value": {
                                    $gte: 4.0
                                }
                            }
                        ]
                    };
                    var HTSSecondSleepUpdate = {
                        "item.lastChangeHTSTime": +worldTime.milliseconds,
                        $inc: {
                            "item.hunger.value": 0.5,
                            "item.thirst.value": 1.0,
                            "item.somnolency.value": -4.0
                        }
                    };
                    var HTSFirstActiveQuery = {
                        $and: [
                            {
                                "item.lastChangeHTSTime": {
                                    $lte: periodEnd
                                }
                            },
                            {
                                "item.lastChangeHTSTime": {
                                    $gt: periodStart
                                }
                            },
                            {
                                state: 'active'
                            }
                        ]
                    };
                    var HTSFirstActiveUpdate = {
                        "item.lastChangeHTSTime": +worldTime.milliseconds,
                        $inc: {
                            "item.hunger.value": 1.0,
                            "item.thirst.value": 1.0,
                            "item.somnolency.value": 2.0
                        }
                    };

                    async.series([
                        function(callback) {
                            updatePersons(HTSFirstSleepQuery, HTSFirstSleepUpdate, options, callback);
                        },
                        function(callback) {
                            updatePersons(HTSSecondSleepQuery, HTSSecondSleepUpdate, options, callback);
                        },
                        function(callback) {
                            updatePersons(HTSFirstActiveQuery, HTSFirstActiveUpdate, options, callback);
                        }
                        ],
                        function(err){
                            if(err){
                                console.log(err);
                                log.error(err);
                                cb(err);
                            } else {
                                done();
                            }
                        }
                    );
                });
            }
        );

        /* Обновляем состояния персонажей - сон и бодрствование. Сейчас захардкожены следующие условия:
         *      пробуждение возможно с 6 утра до 20 вечера при сонливости < 4.0%
         *      засыпание возможно с 20 вечера до 6 утра при сонливости > 30%
         *      если персонаж активен и не голоден (голод и жажда менее 4%) и усталость менее %  и сонливость менее % - начинаем работу
         *      если персонаж работает и усталость более % - отправляем его отдыхать
         *      если персонаж работает и сонливость более % - завершаем работу
         *
         */
        agenda.define('changePersonState',
            function(job, done){
                timeSettings.getWorldTime(function(err, worldTime){
                    if(err){
                        console.log(err);
                        log.error(err);
                        cb(err);
                    }

                    var stateActiveQuery = {
                        $and: [
                            {
                                state: 'sleep'
                            },
                            {
                                "item.somnolency.value": {
                                    $lt: 4.0
                                }
                            }
                        ]
                    };
                    var stateActiveUpdate = {
                        $set: {
                            "state": 'active'
                        }
                    };

                    var stateSleepQuery = {
                        $and: [
                            {
                                state: 'active'
                            },
                            {
                                "item.somnolency.value": {
                                    $gt: 30.0
                                }
                            }
                        ]
                    };
                    var stateSleepUpdate = {
                        $set: {
                            "state": 'sleep'
                        }
                    };
                    console.log("Сейчас " + worldTime.hour + ':' + worldTime.minute);
                    async.series([
                        function(callback){
                            if((+worldTime.hour >= 6) && (+worldTime.hour < 20)){
                                console.log("Начинаем пробуждение!");
                                updatePersons(stateActiveQuery, stateActiveUpdate, options, callback);
                            } else {
                                callback();
                            }
                        },
                        function(callback){
                            if((+worldTime.hour >= 20) || (+worldTime.hour < 6)){
                                console.log("Начинаем усыпление!");
                                updatePersons(stateSleepQuery, stateSleepUpdate, options, callback);
                            } else {
                                callback();
                            }
                        }
                        ],
                        function(err){
                            if(err){
                                console.log(err);
                                log.error(err);
                                cb(err);
                            } else {
                                done();
                            }
                        }
                    );
                });
            }
        );

        /* Если персонаж не спит и уровни голода более 6%, а жажды более 3% - кормим и поим их (обнуляем показатели)
         *    если песонаж испытывает жажду - поим (обнуляем только показатель жажды)
         *    если персонаж испытывает голод - кормим и поим (обнуляем оба показателя)
         */
        agenda.define('getEatAndDrink',
            function(job, done){
                var drinkQuery = {
                    $and: [
                        {
                            state: 'active'
                        },
                        {
                            "item.thirst.value": {
                                $gte: 3.0
                            }
                        }
                    ]
                };
                var drinkUpdate = {
                    $set: {
                        "item.thirst.value": 0.0
                    }
                };

                var eatAndDrinkQuery = {
                    $and: [
                        {
                            state: 'active'
                        },
                        {
                            "item.hunger.value": {
                                $gte: 6.0
                            }
                        }
                    ]
                };
                var eatAndDrinkUpdate = {
                    $set: {
                        "item.thirst.value": 0.0,
                        "item.hunger.value": 0.0
                    }
                };
                async.series([
                        function(callback){
                            console.log("Кормим и поим!");
                            updatePersons(eatAndDrinkQuery, eatAndDrinkUpdate, options, callback);
                        },
                        function(callback){
                                console.log("Поим");
                                updatePersons(drinkQuery, drinkUpdate, options, callback);
                        }
                    ],
                    function(err){
                        if(err){
                            console.log(err);
                            log.error(err);
                            cb(err);
                        } else {
                            done();
                        }
                    }
                );
            }
        );
        agenda.every(agendaCheckStatePeriod, 'changePersonState');
        agenda.every(agendaCheckHTSPeriod, 'changeHTS');
        agenda.every(agendaCheckEatDrinkPeriod, 'getEatAndDrink');
        agenda.start();
    });
};
