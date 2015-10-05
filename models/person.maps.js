'use strict';
var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    personId: Schema.Types.ObjectId,
    maps: [{
        _id: false,
        chunkId: Schema.Types.ObjectId,
        jobs: [{
            job: String,
            rating: Number
        }]
    }]
});

schema.statics.getPersonMap = (personId, callback) => {
    let PersonMap = mongoose.model('person.maps', schema);
    PersonMap.findOne({personId: personId}, (err, personMap) => {
        if (err) {
            log.error(err);
            callback(err);
        }
        callback(null, personMap);
    });
};

schema.statics.isPersonKnowChunk = (personId, chunkId, callback) => {
    let PersonMap = mongoose.model('person.maps', schema);
    PersonMap.findOne({personId: personId, 'maps.chunkId': chunkId}, (err, personMap) => {
        if (err) {
            log.error(err);
            callback(err);
        }
        if (personMap) {
            callback(null, true);
        }
        callback(null, false);
    });
};

schema.statics.getPersonJobChunk = (personId, job, location, callback) => {
    let PersonMap = mongoose.model('person.maps', schema);
    PersonMap.find({personId: personId, 'maps.jobs.job': job}, (err, personMap) => {
        if (err) {
            log.error(err);
            callback(err);
        }
        /* Тут нужно будет добавить блок поиска самого лучшего чанка
        *  А сейчас тупо возвращаем первый
        */
        callback(null, personMap[0]);
    });
};

schema.statics.getPersonExploreChunk = (personId, job, location, callback) => {
    let PersonMap = mongoose.model('person.maps', schema);
    PersonMap.find({personId: personId, 'maps.jobs.job': job}, (err, personMap) => {
        if (err) {
            log.error(err);
            callback(err);
        }
        /* Если вообще нет исследованных чанков - возвращаем тот, в котором находится персонаж */
        if (!personMap || personMap.length == 0) {
            callback(location);
        }
        /* В противном случаем начинаем как-то искать перспективные чанки
        * А пока вернем тупо первый
        * */
        callback(personMap[0]);
    });
};

schema.statics.addOrUpdateChunk = (personId, chunk, callback) => {
    let PersonMap = mongoose.model('person.maps', schema);
    PersonMap.getPersonMap(personId, (err, personMap) => {
        if (err) {
            log.error(err);
            callback(err);
        }
        if (!personMap) {
            // Если такой записи еще нет - создаём её и добавляем чанк в карту персонажа
            personMap = new PersonMap({personId: personId});
            personMap.maps.push(chunk);
            // Если есть - проверяем наличие такого чанка среди известных персонажу. Если известен - обновляем
        } else {
            let isKnow = false;
            for (let i = 0; i < personMap.maps.length; i++) {
                if (!(personMap.maps[i].chunkId).equals(chunk.chunkId)) continue;
                for (let key in chunk) {
                    if (!chunk.hasOwnProperty(key)) continue;
                    personMap.maps[i][key] = chunk[key];
                }
                isKnow = true;
            }
            if (!isKnow) {
                personMap.maps.push(chunk);
            }
        }
        personMap.save((err, callback) => {
            if (err) {
                log.error(err);
                callback(err);
            }
            callback(null, true);
        });
    });
};

exports.personMap = mongoose.model('person.maps', schema);
