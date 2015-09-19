'use strict';
// var log = require('../libs/log')(module);
// var timeSettings = require('../models/settings').timeSettings;
// var configSettings = require('../models/settings').configSettings;
// var Person = require('../models/person').Person;
var Chars = require('../models/person.characteristic').PersonCh;
var config = require('../config/index.js');
// var async = require('async');
var Agenda = require('agenda');
var hub = require('../config/hub');


module.exports = () => {
    var agenda = new Agenda({db: { address: config.get('mongoose:uri')}});

    agenda.cancel({name: 'getEatAndDrink'}, () => {
        // console.log('Отменили старое задание getEatAndDrink');
    });
    agenda.cancel({name: 'changeHTS'}, () => {
        // console.log('Отменили старое задание changeHTS');
    });
    var checkHTSPeriod = Math.floor((hub.config.checkPeriods.checkHTSEveryMinutes * 60) /
    (hub.config.worldTimeSpeedKoef * hub.config.calendar.worldCalendarKoef));
    var checkEatDrinkPeriod = Math.floor((hub.config.checkPeriods.checkEatDrinkEveryMinutes * 60) /
    (hub.config.worldTimeSpeedKoef * hub.config.calendar.worldCalendarKoef));
    var agendaCheckHTSPeriod = checkHTSPeriod + ' seconds';
    var agendaCheckEatDrinkPeriod = checkEatDrinkPeriod + ' seconds';
    console.log('Проверка жизненных характеристик должна запускаться каждые ' + agendaCheckHTSPeriod);
    console.log('Проверка на кормление и поение должна запускаться каждые ' + agendaCheckEatDrinkPeriod);

    agenda.define('getEatAndDrink',
        (job, done) => {
            let t1 = Date.now();
            let query = { $and: [ { state: 'rest' } ] };
            let stream = Chars.find(query).stream();
            stream.on('data', ch => {
                if (ch.item.hunger.value >= 6.0) {
                    ch.item.hunger.value = 0.0;
                    ch.item.thirst.value = 0.0;
                }
                if (ch.item.thirst.value >= 6.0) {
                    ch.item.thirst.value = 0.0;
                }
                ch.markModified('item');
                ch.save();
            }).on('error', error => {
                console.log(error);
            })
                .on('close', () => {
                    console.log(`Закончили обновление EatAndDrink: ${Date.now() - t1} мс`);
                    done();
                });
        }
    );

    agenda.define('changeHTS',
        (job, done) => {
            let t1 = Date.now();
            // тестовый "синий" персонаж: {personId: '55913fe453470d6216a7f6ff'}
            let stream = Chars.find().stream();
            stream.on('data', ch => {
                // отношение к часам времени, прошедшего с момента последнего обновления
                let period = ( (hub.time.milliseconds - ch.item.lastChangeHTSTime) *
                    hub.config.calendar.worldCalendarKoef) / (1000 * 3600);
                ch.item.lastChangeHTSTime = +hub.time.milliseconds;
                for (let key in hub.config.changeSpeed[ch.state]) {
                    if (!hub.config.changeSpeed[ch.state][key]) {
                        continue;
                    }
                    ch.item[key].value += (hub.config.changeSpeed[ch.state][key] * period);
                    if (ch.item[key].value < 0) {
                        ch.item[key].value = 0.0;
                    }
                }
                ch.markModified('item');
                ch.save();
            })
            .on('error', (err) => {
                console.log(err);
            })
            .on('close', () => {
                console.log(`Закончили обновление HTS: ${Date.now() - t1} мс`);
                done();
            });
        }
    );
    agenda.every(agendaCheckHTSPeriod, 'changeHTS');
    agenda.every(agendaCheckEatDrinkPeriod, 'getEatAndDrink');
    // agenda.every(agendaCheckStatePeriod, 'changePersonState');
    agenda.start();
    /*
    configSettings.getConfig((err, curConfig) => {
        if (err) {
            log.error(err);
            console.log(err);
            cb(err);
        }
        var updates = {
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
            ]
        };

        // Грязный хак, 5000 миллисекунд реала в одной минуте мира (worldCalendarKoef == 12)
        var worldMinute = 5000;


        agenda.cancel({name: 'changePersonState'}, () => {
            // console.log('Отменили старое задание changePersonState');
        });
        agenda.cancel({name: 'changePersonAction'}, () => {
            // console.log('Отменили старое задание changePersonActive');
        });

        var checkStatePeriod = Math.floor((+curConfig.checkPeriods.checkStatesEveryMinutes * 60) /
                            (+curConfig.worldTimeSpeedKoef * +curConfig.calendar.worldCalendarKoef));

        var checkActionPeriod = Math.floor((+curConfig.checkPeriods.checkActionsEveryMinutes * 60) /
                            (+curConfig.worldTimeSpeedKoef * +curConfig.calendar.worldCalendarKoef));

        var agendaCheckStatePeriod = checkStatePeriod + ' seconds';
        var agendaCheckActionPeriod = checkActionPeriod + ' seconds';

        // console.log('Проверка состояний должна запускаться каждые ' + agendaCheckStatePeriod);
        // console.log('Проверка действий (активностей) должна запускаться каждые ' + agendaCheckActionPeriod);


        /* Обновляем состояния персонажей - сон и бодрствование. Сейчас захардкожены следующие условия:
         *      пробуждение возможно с 6 утра до 20 вечера при сонливости < 4.0%
         *      засыпание возможно с 20 вечера до 6 утра при сонливости > 30%
         *      состояние 'передвижение' устанавливается отдельно
         *
         */
    /*
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
    /*
    });
    */
};
