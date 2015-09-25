// var log = require('../libs/log')(module);
var config = require('../config/index.js');
var Agenda = require('agenda');
var hub = require('../config/hub');
var workAction = require('./jobs/workAction.js');

module.exports = () => {
    var agenda = new Agenda({db: { address: config.get('mongoose:uri')}});
    agenda.cancel({name: 'checkWork'}, () => {});
    var checkWorkPeriod = Math.floor((hub.config.checkPeriods.checkWorkEveryMinutes * 60) /
    (hub.config.worldTimeSpeedKoef * hub.config.calendar.worldCalendarKoef));
    var agendaCheckWorkPeriod = checkWorkPeriod + ' seconds';
    console.log('Проверка работы должна запускаться каждые ' + agendaCheckWorkPeriod);
    agenda.define('checkWork',
        (job, done) => {
            workAction(done);
        }
    );
    agenda.every(agendaCheckWorkPeriod, 'checkWork');
    agenda.start();
};
