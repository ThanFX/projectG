'use strict';
var Chars = require('../../models/person.characteristic').PersonCh;
var hub = require('../../config/hub');

module.exports = (done) => {
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
        console.log(`Закончили обновление HTFS, ${count} персонажей: ${Date.now() - t1} мс`);
        done();
    });
};
