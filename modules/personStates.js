'use strict';

var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;
var configSettings = require('../models/settings').configSettings;
// var Person = require('../models/person').Person;
var Chars = require('../models/person.characteristic').PersonCh;
var config = require('../config/index.js');
var async = require('async');
var Agenda = require('agenda');

module.exports = (cb) => {
    var agenda = new Agenda({db: { address: config.get('mongoose:uri')}});

    configSettings.getConfig((err, curConfig) => {
        if (err) {
            log.error(err);
            console.log(err);
            cb(err);
        }
        let options = {
            multi: true
        };
        var updates = {
            eatAndDrink: [
                {
                    // Голод более 6 - едим и пьем
                    message: 'Поели и попили: ',
                    queryString: {
                        $and: [
                            {
                                state: 'active'
                            },
                            {
                                'item.hunger.value': {
                                    $gte: 6.0
                                }
                            }
                        ]
                    },
                    updateString: {
                        $set: {
                            'item.thirst.value': 0.0,
                            'item.hunger.value': 0.0
                        }
                    }
                },
                {
                    // Жажда более 6 - пьем
                    message: 'Попили: ',
                    queryString: {
                        $and: [
                            {
                                state: 'active'
                            },
                            {
                                'item.thirst.value': {
                                    $gte: 6.0
                                }
                            }
                        ]
                    },
                    updateString: {
                        $set: {
                            'item.thirst.value': 0.0
                        }
                    }
                }
            ],
            state: [
                {
                    // Спим и сонливость меньше 6 - просыпаемся
                    message: 'Проснулось: ',
                    queryString: {
                        $and: [
                            {
                                state: 'sleep'
                            },
                            {
                                'item.somnolency.value': {
                                    $lt: 6.0
                                }
                            }
                        ]
                    },
                    updateString: {
                        $set: {
                            state: 'rest'
                        }
                    }
                },
                {
                    // Не спим (отдыхаем) и сонливость больше 30 - ложимся спать
                    message: 'Заснуло: ',
                    queryString: {
                        $and: [
                            {
                                state: 'rest'
                            },
                            {
                                'item.somnolency.value': {
                                    $gt: 30.0
                                }
                            }
                        ]
                    },
                    updateString: {
                        $set: {
                            state: 'sleep'
                        }
                    }
                }
            ],
            action: [
                {
                    queryString: {

                    },
                    updateString: {

                    }
                },
                {
                    queryString: {

                    },
                    updateString: {

                    }
                }
            ]
        };
        function updatePersons (query, doc, options, msg, callback) {
            Chars.update(query, doc, options, (err, row) => {
                if (err) {
                    return callback(err);
                }
                console.log(msg + row.n);
                callback();
            });
        }
        function createHTFSAsync (result, done) {
            async.map(result,
                (resultString, callback) => {
                    updatePersons(resultString.queryString, resultString.updateString,
                        options, resultString.message, callback);
                },
                (err) => {
                    if (err) {
                        console.log(err);
                        log.error(err);
                        cb(err);
                    } else {
                        done();
                    }
                }
            );
        }
        // Грязный хак, 5000 миллисекунд реала в одной минуте мира (worldCalendarKoef == 12)
        // var worldMinute = 5000;

        agenda.cancel({name: 'changeHTS'}, () => {
            console.log('Отменили старое задание changeHTS');
        });
        agenda.cancel({name: 'changePersonState'}, () => {
            console.log('Отменили старое задание changePersonState');
        });
        agenda.cancel({name: 'getEatAndDrink'}, () => {
            console.log('Отменили старое задание getEatAndDrink');
        });
        agenda.cancel({name: 'changePersonAction'}, () => {
            console.log('Отменили старое задание changePersonActive');
        });

        var checkStatePeriod = Math.floor((+curConfig.checkPeriods.checkStatesEveryMinutes * 60) /
                            (+curConfig.worldTimeSpeedKoef * +curConfig.calendar.worldCalendarKoef));

        var checkHTSPeriod = Math.floor((+curConfig.checkPeriods.checkHTSEveryMinutes * 60) /
                            (+curConfig.worldTimeSpeedKoef * +curConfig.calendar.worldCalendarKoef));

        var checkEatDrinkPeriod = Math.floor((+curConfig.checkPeriods.checkEatDrinkEveryMinutes * 60) /
                            (+curConfig.worldTimeSpeedKoef * +curConfig.calendar.worldCalendarKoef));

        var checkActionPeriod = Math.floor((+curConfig.checkPeriods.checkActionsEveryMinutes * 60) /
                            (+curConfig.worldTimeSpeedKoef * +curConfig.calendar.worldCalendarKoef));

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
            (job, done) => {
                timeSettings.getWorldTime((err, worldTime) => {
                    if (err) {
                        console.log(err);
                        log.error(err);
                        cb(err);
                    }
                    require('../config/htfs').then(
                        result => {
                            for (let i = 0; i < result.length; i++) {
                                result[i].updateString.$set['item.lastChangeHTSTime'] = +worldTime.milliseconds;
                                // updates.htfs[i].queryString.$and.push({'item.lastChangeHTSTime': {$lte: periodEnd}});
                                // updates.htfs[i].queryString.$and.push({'item.lastChangeHTSTime': {$gt: periodStart}});
                            }
                            createHTFSAsync(result, done);
                        },
                        error => {
                            console.log(error);
                            log.error(error);
                            cb(error);
                        }
                    );


                    // Берем персонажей, у которых последнее обновление характеристик было не менее часа и не более 2 часов назад
                    // var periodStart = +worldTime.milliseconds - (worldMinute * 120);
                    // var periodEnd = +worldTime.milliseconds - (worldMinute * 55);

                    // А нужно ли вообще это??? Гораздо проще просто инкрементить показатели по таймеру и всё. Погрешность возможна только на этапе запуска сервера.
                    // Пока оставляю только таймстамп последнего обновления. Так, на всякий случай
                });
            }
        );

        /* Обновляем состояния персонажей - сон и бодрствование. Сейчас захардкожены следующие условия:
         *      пробуждение возможно с 6 утра до 20 вечера при сонливости < 4.0%
         *      засыпание возможно с 20 вечера до 6 утра при сонливости > 30%
         *      состояние 'передвижение' устанавливается отдельно
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

                    console.log('Сейчас ' + worldTime.hour + ':' + worldTime.minute);
                    // Пока так, дальше будет видно
                    async.series([
                        function(callback){
                            if((+worldTime.hour >= 6) && (+worldTime.hour < 20)){
                                updatePersons(updates.state[0].queryString, updates.state[0].updateString, options, updates.state[0].message, callback);
                            } else {
                                callback();
                            }
                        },
                        function(callback){
                            if((+worldTime.hour >= 20) || (+worldTime.hour < 6)){
                                updatePersons(updates.state[1].queryString, updates.state[1].updateString, options, updates.state[1].message, callback);
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
                            'personId': '55913fe453470d6216a7f6ff'
                        },
                        {
                            state: 'active'
                        },
                        {
                            action: 'none'
                        },
                        {
                            'item.hunger.value': {
                                $lte: 6.0
                            }
                        },
                        {
                            'item.thirst.value': {
                                $lte: 6.0
                            }
                        },
                        {
                            'item.somnolency.value': {
                                $lte: 10
                            }
                        },
                        {
                            'item.fatigue.value': {
                                $lte: 10
                            }
                        }
                    ]
                };
                var workStartUpdate = {
                    $set: {
                        'action': 'work'
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
                            'item.somnolency.value': {
                                $gte: 24
                            }
                        },
                        {
                            'item.fatigue.value': {
                                $gte: 80
                            }
                        }
                    ]
                };
                var workEndUpdate = {
                    $set: {
                        'action': 'none'
                    }
                };
                /*
                async.series([
                        function(callback){
                            console.log('Без труда нет жратвы!');
                            updatePersons(workStartQuery, workStartUpdate, options, '', callback);
                        },
                        function(callback){
                            console.log('От работы кони дохнут!');
                            updatePersons(workEndQuery, workEndUpdate, options, '', callback);
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
                */
            }
        );

        /* Если персонаж не спит и уровни голода более 6% и жажды более 6% - кормим и поим их (обнуляем показатели)
         *    если песонаж испытывает жажду - поим (обнуляем только показатель жажды)
         *    если персонаж испытывает голод - кормим и поим (обнуляем оба показателя)
         */
        agenda.define('getEatAndDrink',
            function(job, done){
                async.map(updates.eatAndDrink,
                    function(eatAndDrink, callback) {
                        updatePersons(eatAndDrink.queryString, eatAndDrink.updateString, options, eatAndDrink.message, callback);
                    },
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
