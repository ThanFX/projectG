var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;
var configSettings = require('../models/settings').configSettings;
var config = require('../config/index.js');
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

        agenda.define('Self-checking',
            function(job, done) {
                console.log('Agenda должна запускаться каждые ' + agendaCheckStatePeriod + '. Сейчас ' + Date.now());
                done();
            });

        agenda.every(agendaCheckStatePeriod, 'Self-checking');
        agenda.start();
    });
};
