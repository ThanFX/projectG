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
    created: {
        type: Date,
        default: Date.now
    }
});

schema.static.upsertPersonCharacteristics = function(personId, characteristics, location, callback){
    var Ch = this;
    Person.isPerson(personId, function(err, person){
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
        }
    });
};

exports.PersonCharacteristic = mongoose.model('Person.Characteristic', schema);