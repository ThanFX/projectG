var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var async = require('async');
var Schema = mongoose.Schema;

var schema = new Schema({
    personId: Schema.Types.ObjectId,
    maps: [{
        _id: false,
        chunkId: Schema.Types.ObjectId
    }]
});

schema.statics.getPersonMap = function(personId, callback){
    this.findOne({personId: personId}, function(err, personMap){
        if(err){
            log.error(err);
            callback(err);
        }
        callback(null, personMap);
    })
};

schema.statics.isPersonKnowChunk = function(personId, chunkId, callback){
    var PersonMap = this;
    PersonMap.findOne({personId: personId, 'maps.chunkId': chunkId}, function(err, personMap){
        if(err) {
            log.error(err);
            callback(err);
        }
        if(personMap){
            callback(null, true);
        }
        callback(null, false);
    });
};

schema.statics.addOrUpdateChunk = function(personId, chunk, callback){
    var PersonMap = this;
    PersonMap.getPersonMap(personId, function(err, personMap){
        if(err){
            log.error(err);
            callback(err);
        }

        if(!personMap){
            // Если такой записи еще нет - создаём её и добавляем чанк в карту персонажа
            personMap = new PersonMap({personId: personId});
            personMap.maps.push(chunk);
            // Если есть - проверяем наличие такого чанка среди известных персонажу. Если известен - обновляем
        } else {
            var isKnow = false;
            for(var i = 0; i < personMap.maps.length; i++){
                if(!(personMap.maps[i].chunkId).equals(chunk.chunkId)) continue;
                for(var key in chunk){
                    if(!chunk.hasOwnProperty(key)) continue;
                    personMap.maps[i][key] = chunk[key];
                }
                isKnow = true;
            }
            if(!isKnow){
                personMap.maps.push(chunk);
            }
        }

        personMap.save(function(err, callback){
            if(err){
                log.error(err);
                callback(err);
            }
            callback(null, true);
        });
    });
};

exports.personMap = mongoose.model('personMap', schema);