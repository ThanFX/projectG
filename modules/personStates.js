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
    agenda.cancel({name: 'changePersonAction'}, function(){
        console.log('Отменили старое задание changePersonActive');
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

        var checkActionPeriod = Math.floor((+curConfig.params.checkPeriods.checkActionsEveryMinutes * 60) /
                            (+curConfig.params.worldTimeSpeedKoef * +curConfig.params.calendar.worldCalendarKoef));

        var agendaCheckStatePeriod = checkStatePeriod + ' seconds';
        var agendaCheckHTSPeriod = checkHTSPeriod + ' seconds';
        var agendaCheckEatDrinkPeriod = checkEatDrinkPeriod + ' seconds';
        var agendaCheckActionPeriod = checkActionPeriod + ' seconds';

        console.log('Проверка состояний должна запускаться каждые ' + agendaCheckStatePeriod);
        console.log('Проверка действий (активностей) должна запускаться каждые ' + agendaCheckActionPeriod);
        console.log('Проверка жизненных характеристик должна запускаться каждые ' + agendaCheckHTSPeriod);
        console.log('Проверка на кормление и поение должна запускаться каждые ' + agendaCheckEatDrinkPeriod);

        /* Обновляем жизненные характеристики персонажей - голод, жажду и сонливость. Сейчас захардкожены следующие коэффициенты (в час):
         *      голод: +0,5 во сне, +1 при бодрствовании
         *      жажда: +2 всегда
         *      сонливость: -4 во сне, +2 при бодрствовании
         * При изменении показателей берем только тех персонажей, у которых с момента последнего изменения прошло от 1 до 2 часов.
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
                            "item.thirst.value": 2.0
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
                            "item.thirst.value": 2.0,
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
                            "item.thirst.value": 2.0,
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
         *      состояние "передвижение" устанавливается отдельно
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
                            "state": 'active',
                            "action": 'none'
                        }
                    };

                    var stateSleepQuery = {
                        $and: [
                            {
                                state: 'active'
                            },
                            {
                                action: 'none'
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
                            "state": 'sleep',
                            "action": 'none'
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

        /* Работаем с активностями персонажей - заставляем работать. Сейчас захардкожены следующие условия:
         *      если персонаж активен, ничего не делает, не голоден (голод и жажда менее 6%) и усталость менее 10% и сонливость менее 10% - начинаем работу
         *      если персонаж работает и усталость более 80% - отправляем его отдыхать
         *      если персонаж работает и сонливость более 24% и усталость более 80% - завершаем работу
         *
         */
        agenda.define('changePersonAction',
            function(job, done){
                var workStartQuery = {
                    $and: [
                        // Тестовый рыболов!
                        {
                            "personId": '55913fe453470d6216a7f6ff'
                        },
                        {
                            state: 'active'
                        },
                        {
                            action: 'none'
                        },
                        {
                            "item.hunger.value": {
                                $lte: 6.0
                            }
                        },
                        {
                            "item.thirst.value": {
                                $lte: 6.0
                            }
                        },
                        {
                            "item.somnolency.value": {
                                $lte: 10
                            }
                        },
                        {
                            "item.fatigue.value": {
                                $lte: 10
                            }
                        }
                    ]
                };
                var workStartUpdate = {
                    $set: {
                        "action": 'work'
                    }
                };
                var workEndQuery = {
                    $and: [
                        {
                            state: 'active'
                        },
                        {
                            action: 'work'
                        },
                        {
                            "item.somnolency.value": {
                                $gte: 24
                            }
                        },
                        {
                            "item.fatigue.value": {
                                $gte: 80
                            }
                        }
                    ]
                };
                var workEndUpdate = {
                    $set: {
                        "action": 'none'
                    }
                };
                async.series([
                        function(callback){
                            console.log("Без труда нет жратвы!");
                            updatePersons(workStartQuery, workStartUpdate, options, callback);
                        },
                        function(callback){
                            console.log("От работы кони дохнут!");
                            updatePersons(workEndQuery, workEndUpdate, options, callback);
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

        /* Если персонаж не спит и уровни голода более 6% и жажды более 6% - кормим и поим их (обнуляем показатели)
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
                                $gte: 6.0
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
        agenda.every(agendaCheckActionPeriod, 'changePersonAction');
        agenda.every(agendaCheckHTSPeriod, 'changeHTS');
        agenda.every(agendaCheckEatDrinkPeriod, 'getEatAndDrink');
        agenda.start();
    });
};
