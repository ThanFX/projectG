var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var async = require('async');
var Person = require('../models/person').Person;
var Schema = mongoose.Schema;

var schema = new Schema({
    personId: Schema.ObjectId,
    item: [{
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

schema.static.upsertPCh = function(/*personId, state, characteristics, location*/ q, callback){
    console.log("!!");
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
                }
                if(location){
                    values.item = location;
                    values.markModified('location');
                }
                values.save(function(err){
                    if(err){
                        callback(err);
                    }
                    callback(null, values);
                });
            });
        } else {
            log.warn("Пользователь " + personId + " не существует");
            callback("User not found", null);
        }
    });
};

exports.PersonCh = mongoose.model('Person.Characteristic', schema);