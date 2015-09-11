var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;
var configSettings = require('../models/settings').configSettings;
var Person = require('../models/person').Person;
var Chars = require('../models/person.characteristic').PersonCh;
var config = require('../config/index.js');
var async = require('async');
var Agenda = require('agenda');

module.exports = function(cb){
    var agenda = new Agenda({db: { address: config.get('mongoose:uri')}});

    agenda.cancel({name: 'checkWork'}, function(){
        console.log('Отменили старое задание checkWork');
    });

    configSettings.getConfig(function (err, curConfig) {
        if (err) {
            log.error(err);
            console.log(err);
            cb(err);
        }
        var options = {
            multi: true
        };
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
        var checkWorkPeriod = Math.floor((+curConfig.checkPeriods.checkWorkEveryMinutes * 60) /
        (+curConfig.worldTimeSpeedKoef * +curConfig.calendar.worldCalendarKoef));
        var agendaCheckWorkPeriod = checkWorkPeriod + ' seconds';
        console.log('Проверка работы должна запускаться каждые ' + agendaCheckWorkPeriod);
        agenda.define('checkWork',
            function(job, done){
                console.log("Проверяем работу!");
                done();
            }
        );

        agenda.every(agendaCheckWorkPeriod, 'checkWork');
        //agenda.start();
    });



};