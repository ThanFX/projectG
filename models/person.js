var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var async = require('async');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    job: String,
    home: String,
    skills: [{
        skillType: String,
        skillLevel: Number
    }]
});

schema.static.isPerson = function(personId, callback){
    this.findOne({_id: personId}, function(err, person){
        if(err){
            callback(err);
        }
        if(person){
            callback(err, person);
        } else {
            log.warn("Персонажа " + personId + " не существует");
            callback(null, null);
        }
    })
};

schema.statics.createPerson = function(person, callback) {
    var Person = this;
    var npc = new Person(person);
    var skill = {
        type: person.skills.type,
        level: person.skills.level
    };
    //npc.skills.push(person.skills);
    
    npc.markModified('skills');
    npc.save(function(err){
        if (err){
            callback(err);
        }
        log.info("Person " + npc.name + ' create successful');
        callback(null, npc);
    });
};

exports.Person = mongoose.model('Persons', schema);