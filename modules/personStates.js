'use strict';
// var log = require('../libs/log')(module);
var config = require('../config/index.js');
var Agenda = require('agenda');
var hub = require('../config/hub');
var eatAndDrink = require('./jobs/EatAndDrink');
var htfs = require('./jobs/htfs');
var sleepState = require('./jobs/sleepState');

module.exports = () => {
    var agenda = new Agenda({db: { address: config.get('mongoose:uri')}});
    agenda.cancel({name: 'getEatAndDrink'}, () => {});
    agenda.cancel({name: 'changeHTS'}, () => {});
    agenda.cancel({name: 'changePersonState'}, () => {});
    var checkHTSPeriod = Math.floor((hub.config.checkPeriods.checkHTSEveryMinutes * 60) /
    (hub.config.worldTimeSpeedKoef * hub.config.calendar.worldCalendarKoef));
    var checkEatDrinkPeriod = Math.floor((hub.config.checkPeriods.checkEatDrinkEveryMinutes * 60) /
    (hub.config.worldTimeSpeedKoef * hub.config.calendar.worldCalendarKoef));
    var checkStatePeriod = Math.floor((hub.config.checkPeriods.checkStatesEveryMinutes * 60) /
    (hub.config.worldTimeSpeedKoef * hub.config.calendar.worldCalendarKoef));
    var agendaCheckHTSPeriod = checkHTSPeriod + ' seconds';
    var agendaCheckEatDrinkPeriod = checkEatDrinkPeriod + ' seconds';
    var agendaCheckStatePeriod = checkStatePeriod + ' seconds';
    console.log('Проверка жизненных характеристик должна запускаться каждые ' + agendaCheckHTSPeriod);
    console.log('Проверка на кормление и поение должна запускаться каждые ' + agendaCheckEatDrinkPeriod);
    console.log('Проверка состояний должна запускаться каждые ' + agendaCheckStatePeriod);

    agenda.define('getEatAndDrink',
        (job, done) => {
            eatAndDrink(done);
        }
    );
    agenda.define('changeHTS',
        (job, done) => {
            htfs(done);
        }
    );
    agenda.define('changePersonState',
        (job, done) => {
            sleepState(done);
        }
    );
    agenda.every(agendaCheckHTSPeriod, 'changeHTS');
    agenda.every(agendaCheckEatDrinkPeriod, 'getEatAndDrink');
    agenda.every(agendaCheckStatePeriod, 'changePersonState');
    agenda.start();
};
