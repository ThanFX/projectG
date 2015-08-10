var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;
var configSettings = require('../models/settings').configSettings;
var Person = require('../models/person').Person;
var Chars = require('../models/person.characteristic').PersonCh;
var config = require('../config/index.js');
var async = require('async');
var Agenda = require('agenda');
var io = require('../socket');

module.exports = function() {
    var agenda = new Agenda({db: { address: config.get('mongoose:uri')}});




    configSettings.getConfig(function (err, curConfig) {
        if (err) {
            log.error(err);
        }
        var checkStatePeriod = Math.floor((curConfig.params.checkPeriods.checkStatesEveryMinutes * 60) /
                            (curConfig.params.worldTimeSpeedKoef * curConfig.params.calendar.worldCalendarKoef));
        var agendaCheckStatePeriod = checkStatePeriod + ' seconds';
        console.log('Agenda должна запускаться каждые ' + agendaCheckStatePeriod);
        /*
        agenda.define('Self-checking',
            function(job, done){
                console.log('Agenda должна запускаться каждые ' + agendaCheckStatePeriod + '. Сейчас ' + Date.now());
                done();
            }
        );
        */

        agenda.define('changePersonState',
            function(job, done){
                timeSettings.getWorldTime(function(err, worldTime){
                    if(err){
                        console.log(err);
                        log.error(err);
                    }
                    console.log("Сейчас " + worldTime.hour + ':' + worldTime.minute);
                    if(+worldTime.hour >= 6){
                        Person.getPersonCh('*', function(err, persons){
                            if(err){
                                log.error(err);
                            }
                            async.each(persons,
                                function(person, personCallback){
                                    if((person.characterisitics.state == 'Сон') /*&& (person.characterisitics.item[3].value < 20)*/) {
                                        person.characterisitics.state = 'Активен';
                                        person.characterisitics.lastCheckTime = worldTime.milliseconds;
                                        Chars.upsertPCh(person._id, person.characterisitics.lastCheckTime, person.characterisitics.state, person.characterisitics.item, person.characterisitics.location, function (err, ch) {
                                            if (err) {
                                                console.log(err);
                                                log.error(err);
                                            }
                                            console.log(person.name + " проснулся");
                                            personCallback(null, ch);
                                        });
                                    }
                                },
                                function(){
                                    console.log('Всех разбудили');
                                }
                            );
                        });
                    }
                    if((+worldTime.hour >= 22) || (+worldTime.hour < 6)){
                        Person.getPersonCh('*', function(err, persons){
                            if(err){
                                log.error(err);
                            }
                            async.each(persons,
                                function(person, personCallback){
                                    if((person.characterisitics.state == 'Активен') /*&& (person.characterisitics.item[3].value > 10)*/) {
                                        person.characterisitics.state = 'Сон';
                                        person.characterisitics.lastCheckTime = worldTime.milliseconds;
                                        Chars.upsertPCh(person._id, person.characterisitics.lastCheckTime, person.characterisitics.state, person.characterisitics.item, person.characterisitics.location, function (err, ch) {
                                            if (err) {
                                                console.log(err);
                                                log.error(err);
                                            }
                                            console.log(person.name + " уснул");
                                            personCallback(null, ch);
                                        });
                                    }
                                },
                                function(){
                                    console.log('Всех усыпили');
                                }
                            );
                        });
                    }
                });
                done();
            }
        );

        agenda.every(agendaCheckStatePeriod, 'changePersonState');
        agenda.start();
    });
};
