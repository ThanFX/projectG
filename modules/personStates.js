'use strict';
// var log = require('../libs/log')(module);
var Chars = require('../models/person.characteristic').PersonCh;
var config = require('../config/index.js');
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
    agenda.cancel({name: 'changePersonState'}, () => {
        // console.log('Отменили старое задание changePersonState');
    });
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
            let t1 = Date.now();
            let query = { $and: [ { state: 'rest' },
                                  { $or: [
                                      {'item.hunger.value': {$gte: 6.0} },
                                      {'item.thirst.value': {$gte: 6.0} }
                                  ] } ] };
            let count = 0;
            let stream = Chars.find(query).stream();
            stream.on('data', ch => {
                if (ch.item.hunger.value >= 6.0) {
                    ch.item.hunger.value = 0.0;
                    ch.item.thirst.value = 0.0;
                    count++;
                }
                if (ch.item.thirst.value >= 6.0) {
                    ch.item.thirst.value = 0.0;
                    count++;
                }
                ch.markModified('item');
                ch.save();
            }).on('error', error => {
                console.log(error);
            })
                .on('close', () => {
                    console.log(`Закончили обновление EatAndDrink, ${count} персонажей: ${Date.now() - t1} мс`);
                    done();
                });
        }
    );

    agenda.define('changeHTS',
        (job, done) => {
            let t1 = Date.now();
            // тестовый "синий" персонаж: {personId: '55913fe453470d6216a7f6ff'}
            let stream = Chars.find().stream();
            let count = 0;
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
                count++;
                ch.markModified('item');
                ch.save();
            })
            .on('error', (err) => {
                console.log(err);
            })
            .on('close', () => {
                console.log(`Закончили обновление HTS, ${count} персонажей: ${Date.now() - t1} мс`);
                done();
            });
        }
    );
    agenda.define('changePersonState',
        (job, done) => {
            if ((+hub.time.hour >= 6) && (+hub.time.hour < 20)) {
                let t1 = Date.now();
                let query = {$and: [ {state: 'sleep'}, {'item.somnolency.value': {$lt: 6.0} } ] };
                let count = 0;
                let stream = Chars.find(query).stream();
                stream.on('data', ch => {
                    ch.state = 'rest';
                    count++;
                    ch.save();
                })
                .on('error', (err) => {
                    console.log(err);
                })
                .on('close', () => {
                    console.log(`Закончили обновление state со sleep на rest, ${count} персонажей: ${Date.now() - t1} мс`);
                    done();
                });
            }
            if ((+hub.time.hour >= 20) || (+hub.time.hour < 6)) {
                let t1 = Date.now();
                let query = {$and: [ {state: 'rest'}, {'item.somnolency.value': {$gte: 40.0} } ] };
                let count = 0;
                let stream = Chars.find(query).stream();
                stream.on('data', ch => {
                    count++;
                    ch.state = 'sleep';
                    ch.save();
                })
                .on('error', (err) => {
                    console.log(err);
                })
                .on('close', () => {
                    console.log(`Закончили обновление state с rest на sleep, ${count} персонажей: ${Date.now() - t1} мс`);
                    done();
                });
            }
        }
    );
    agenda.every(agendaCheckHTSPeriod, 'changeHTS');
    agenda.every(agendaCheckEatDrinkPeriod, 'getEatAndDrink');
    agenda.every(agendaCheckStatePeriod, 'changePersonState');
    agenda.start();
};
