var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var async = require('async');
var Person = require('../models/person').Person;
var Schema = mongoose.Schema;

var schema = new Schema({
    personId: Schema.ObjectId,
    item: [{
        _id: false,
        name: String,
        value: Number
    }],
    location: {
        x: Number,
        y: Number
    },
    state: String,
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.upsertPCh = function(personId, state, characteristics, location, callback){
    var Ch = this;
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
                if(characteristics){
                    values.item = characteristics;
                    values.markModified('item');
                    console.log(values.item);
                }
                if(location){
                    values.location = location;
                    values.markModified('location');
                    console.log(values.location);
                }
                
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
        callback(null, charcteristics);
    });
};

exports.PersonCh = mongoose.model('Person.Characteristic', schema);