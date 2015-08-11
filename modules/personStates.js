var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;
var configSettings = require('../models/settings').configSettings;
//var Person = require('../models/person').Person;
var Chars = require('../models/person.characteristic').PersonCh;
var config = require('../config/index.js');
//var async = require('async');
var Agenda = require('agenda');

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
                        Chars.update({state:"Сон"}, {state:"Активен", lastCheckTime = worldTime.milliseconds}, {multi: true}, function(err){
                            if(err){
                                console.log(err);
                                log.error(err);
                            } else {
                                console.log('Разбудили спящих');
                            }
                        });
                    }
                    if((+worldTime.hour >= 22) || (+worldTime.hour < 6)){
                        Chars.update({state:"Активен"}, {state:"Сон", lastCheckTime = worldTime.milliseconds}, {multi: true}, function(err){
                            if(err){
                                console.log(err);
                                log.error(err);
                            } else {
                                console.log('Усыпили бодрствующих');
                            }
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
