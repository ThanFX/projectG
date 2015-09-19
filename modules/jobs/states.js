'use strict';
var Chars = require('../../models/person.characteristic').PersonCh;
var hub = require('../../config/hub');

module.exports = (done) => {
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
};
