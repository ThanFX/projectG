'use strict';
var Chars = require('../../models/person.characteristic').PersonCh;

module.exports = (done) => {
    let t1 = Date.now();

    let query = {$and: [
                    {personId: '55913fe453470d6216a7f6ff'},
                    {state: 'rest'},
                    {action: 'none'},
                    {'item.hunger.value': {$lte: 3.0} },
                    {'item.thirst.value': {$lte: 3.0} },
                    {'item.fatigue.value': {$lte: 10.0} },
                    {'item.somnolency.value': {$lte: 20.0} }
    ] };
    let count = 0;
    let stream = Chars.find(query).stream();
    stream.on('data', ch => {
        ch.action = 'job';
        count++;
        ch.save();
    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('close', () => {
        console.log(`Закончили обновление action с none на job, ${count} персонажей: ${Date.now() - t1} мс`);
        done();
    });
};
