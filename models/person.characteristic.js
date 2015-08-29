var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
//var async = require('async');
var Person = require('../models/person').Person;
var Schema = mongoose.Schema;

var schema = new Schema({
    personId: Schema.ObjectId,
    item: {
        _id: false,
        lastChangeHTSTime: Number,
        type: Schema.Types.Mixed
    },
    location: {
        _id: false,
        x: Number,
        y: Number
    },
    state: String,
    action: String,
    stage: String,
    lastCheckTime: String,
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.upsertPCh = function(personId, lastCheckTime, state, characteristics, location, callback){
    var Ch = this;
    var Person = require('../models/person').Person;
    Person.isPerson({_id: personId}, function(err, person){
        if(err){
            callback(err);
        }
        if(person){
            Ch.findOne({personId: personId}, function(err, values){
                if(err){
                    callback(err);
                }
                if(!values){
                    values = new Ch({personId: personId});
                }
                if(state){
                    values.state = state;
                }
                if(lastCheckTime){
                    values.lastCheckTime = lastCheckTime;
                }

                if(characteristics){
                    values.item = characteristics;
                    values.markModified('items');
                }
                if(location){
                    values.location = location;
                    values.markModified('location');
                }
                console.log(values);
                values.save(function(err, pch){
                    if(err){
                        callback(err);
                    }   
                    callback(null, pch);
                });
            });
        } else {
            log.warn("Пользователь " + personId + " не существует");
            callback("User not found", null);
        }
    });
};

schema.statics.getPCh = function(personId, callback){
    var ch = this;
    ch.findOne({personId: personId}, function(err, charcteristics){
        if(err){
            log.error(err);
            callback(err);
        }
        var ch = {
            state: charcteristics.state,
            location: charcteristics.location,
            item: charcteristics.item
        };
        callback(null, ch);
    });
};

exports.PersonCh = mongoose.model('Person.Characteristic', schema);