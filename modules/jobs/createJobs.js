'use strict';
var Chars = require('../../models/person.characteristic').PersonCh;
var lib = require('../../libs');
var PersonMap = require('../../models/person.maps').personMap;
var PersonJobs = require('../../models/person.jobs').PersonJobs;
var hub = require('../../config/hub');

module.exports = (done) => {
    let t1 = Date.now();

    let query = {$and: [
        {personId: '55913fe453470d6216a7f6ff'},
        {stage: 'none'},
        {action: 'job'},
        {state: 'rest'}
    ] };
    let count = 0;
    let stream = Chars.find(query).stream();
    stream.on('data', ch => {
        let job = ch.skills.job[0];
        // Для работ, которым требуется определённая местность
        if (job.needLocation) {
            // Ищем чанк для работы
            lib.getData(PersonMap.getPersonJobChunk, ch.personId, job.name, ch.location).then(
                personJobMap => {
                    if (personJobMap) {
                        console.log(`Чанк для работы: ${personJobMap}`);
                    } else {
                        console.log('Нет чанков для работы, ищем чанки для исследования');
                        return lib.getData(PersonMap.getPersonExploreChunk, ch.personId, job.name, ch.location);
                    }
                }
            ).then(
                exploreChunk => {
                    // Чанк для исследования есть - создаём задачу на исследование
                    if (exploreChunk) {
                        /* Создаём задачу на исследование */
                        console.log(`Чанк для исследования: ${exploreChunk}`);
                        PersonJobs.createJob({
                            personId: ch.personId,
                            job: 'explore',
                            currentLocation: ch.location,
                            jobLocation: exploreChunk,
                            isFinished: false,
                            startTime: hub.time.milliseconds,
                            /* ToDo! Создаём задачу на 2 часа времени мира, потом нужно будет переделать нормально */
                            endTime: hub.time.milliseconds + (5000 * 120)
                        }, null);
                        ch.action = 'explore';
                    } else {
                        /* В будущем возможно переделать на поиск другой работы */
                        console.log('И для исследования чанков нету, отправляемся заниматься домашними делами');
                        // ch.action = 'none';
                        // ch.state = 'chores';
                    }
                    ch.save();
                }
            ).catch(
                error => console.log(`Ошибка: ${error}`)
            );
        }
        count++;
        // ch.save();
    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('close', () => {
        console.log(`Закончили разбираться с назначением работ, ${count} персонажей: ${Date.now() - t1} мс`);
        done();
    });
};