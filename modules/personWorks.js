// var log = require('../libs/log')(module);
var config = require('../config/index.js');
var Agenda = require('agenda');
var hub = require('../config/hub');
var workAction = require('./jobs/workAction.js');
var createJobs = require('./jobs/createJobs.js');

module.exports = () => {
    var agenda = new Agenda({db: { address: config.get('mongoose:uri')}});
    /* --- Чистим старые задания --- */
    agenda.cancel({name: 'checkWork'}, () => {});
    agenda.cancel({name: 'createJobs'}, () => {});
    /* --- Вычисляем периоды запусков джоб --- */
    var checkWorkPeriod = Math.floor((hub.config.checkPeriods.checkWorkEveryMinutes * 60) /
    (hub.config.worldTimeSpeedKoef * hub.config.calendar.worldCalendarKoef));
    var agendaCheckWorkPeriod = checkWorkPeriod + ' seconds';
    console.log('Проверка работы должна запускаться каждые ' + agendaCheckWorkPeriod);
    var createJobsPeriod = Math.floor((hub.config.checkPeriods.createJobsEveryMinutes * 60) /
    (hub.config.worldTimeSpeedKoef * hub.config.calendar.worldCalendarKoef));
    var agendaCreateJobsPeriod = createJobsPeriod + ' seconds';
    console.log('Проверка работы должна запускаться каждые ' + agendaCreateJobsPeriod);
    /* --- Создаём джобы --- */
    agenda.define('checkWork',
        (job, done) => {
            workAction(done);
        }
    );
    agenda.define('createJobs',
        (job, done) => {
            createJobs(done);
        }
    );
    /* --- и запускаем их --- */
    agenda.every(agendaCheckWorkPeriod, 'checkWork');
    agenda.every(agendaCreateJobsPeriod, 'createJobs');
    agenda.start();
};
