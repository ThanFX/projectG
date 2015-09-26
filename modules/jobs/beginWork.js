'use strict';
var Chars = require('../../models/person.characteristic').PersonCh;

module.exports = (done) => {
    let t1 = Date.now();

    let query = {$and: [
        {personId: '55913fe453470d6216a7f6ff'},
        {state: 'rest'},
        {action: 'job'}
    ] };
    let count = 0;
    let stream = Chars.find(query).stream();
    stream.on('data', ch => {

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