'use strict';
var Chars = require('../../models/person.characteristic').PersonCh;

module.exports = (done) => {
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
};
