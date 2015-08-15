var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;
var configSettings = require('../models/settings').configSettings;
//var Person = require('../models/person').Person;
var Chars = require('../models/person.characteristic').PersonCh;
var config = require('../config/index.js');
//var async = require('async');
var Agenda = require('agenda');

module.exports = function() {
    var agenda = new Agenda({db: { address: config.get('mongoose:uri-v3')}});

    agenda.cancel({name: 'changeLifePersonState'}, function(){
        console.log('Отменили старое задание changeLifePersonState');
    });
    agenda.cancel({name: 'changePersonState'}, function(){
        console.log('Отменили старое задание changePersonState');
    });

    configSettings.getConfig(function (err, curConfig) {
        if (err) {
            log.error(err);
        }
        var checkStatePeriod = Math.floor((+curConfig.params.checkPeriods.checkStatesEveryMinutes * 60) /
                            (+curConfig.params.worldTimeSpeedKoef * +curConfig.params.calendar.worldCalendarKoef));

        var checkLifePeriod = Math.floor((+curConfig.params.checkPeriods.checkLifeEveryMinutes * 60) /
        (+curConfig.params.worldTimeSpeedKoef * +curConfig.params.calendar.worldCalendarKoef));

        var agendaCheckStatePeriod = checkStatePeriod + ' seconds';
        var agendaCheckLifePeriod = checkLifePeriod + ' seconds';
        console.log('Проверка состояний должна запускаться каждые ' + agendaCheckStatePeriod);
        console.log('Проверка жизненных характеристик должна запускаться каждые ' + agendaCheckLifePeriod);
        /*
        agenda.define('Self-checking',
            function(job, done){
                console.log('Agenda должна запускаться каждые ' + agendaCheckStatePeriod + '. Сейчас ' + Date.now());
                done();
            }
        );
        */

        agenda.define('changeLifePersonState',
            function(job, done){

                timeSettings.getWorldTime(function(err, worldTime){
                    if(err){
                        console.log(err);
                        log.error(err);
                    }
                    console.log("Начинаем обновляться");
                    // Грязный хак, 5000 миллисекунд мира в одной минуте
                    var worldMinute = 5000;

                    // Берем персонажей, у которых последнее обновление характеристик было не менее часа и не более 2 часов назад
                    var firstPeriodStart = +worldTime.milliseconds - (worldMinute * 120);
                    var firstPeriodEnd = +worldTime.milliseconds - (worldMinute * 60);

                    var firstSleepPeriodQuery = {
                        $and: [
                            {
                                state: 'Сон'
                            },
                            {
                                "item.lastChangeLifeTime": {
                                    $lte: firstPeriodEnd
                                }
                            },
                            {
                                "item.lastChangeLifeTime": {
                                    $gt: firstPeriodStart
                                }
                            }
                        ]
                    };
                    var firstSleepPeriodUpdate = {
                        "item.lastChangeLifeTime": +worldTime.milliseconds,
                        $inc: {
                            "item.hunger.value": 1
                        }
                    };

                    Chars.update(firstSleepPeriodQuery, firstSleepPeriodUpdate, {multi: true}, function(err, row){
                        if(err) {
                            console.log(err);
                            log.error(err);
                        } else {
                            console.log("Обновили первых спящих: ");
                            console.log(row);
                            done();
                        }
                    });
                });
            }
        );


        agenda.define('changePersonState',
            function(job, done){
                timeSettings.getWorldTime(function(err, worldTime){
                    if(err){
                        console.log(err);
                        log.error(err);
                    }
                    console.log("Сейчас " + worldTime.hour + ':' + worldTime.minute);
                    if(+worldTime.hour >= 6){
                        Chars.update({state:"Сон"}, {state:"Активен", lastCheckTime: worldTime.milliseconds}, {multi: true}, function(err){
                            if(err){
                                console.log(err);
                                log.error(err);
                            } else {
                                console.log('Разбудили спящих');
                                done();
                            }
                        });
                    }
                    if((+worldTime.hour >= 22) || (+worldTime.hour < 6)){
                        Chars.update({state:"Активен"}, {state:"Сон", lastCheckTime: worldTime.milliseconds}, {multi: true}, function(err){
                            if(err){
                                console.log(err);
                                log.error(err);
                            } else {
                                console.log('Усыпили бодрствующих');
                                done();
                            }
                        });
                    }
                });
            }
        );

        //agenda.every(agendaCheckStatePeriod, 'changePersonState');
        agenda.every(agendaCheckLifePeriod, 'changeLifePersonState');
        agenda.start();
    });
};
