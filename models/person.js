var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var async = require('async');
var crypto = require('crypto');
var Schema = mongoose.Schema;


var schema = new Schema({
    name: String,
    job: String,
    home: String,
    skills: [{
        _id: false,
        skillType: String,
        skillLevel: Number
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.isPerson = function(personId, callback){
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
    npc.skills.push(skill);
    npc.markModified('skills');
    npc.save(function(err){
        if (err){
            callback(err);
        }
        log.info("Person " + npc.name + ' create successful');
        callback(null, npc);
    });
};

schema.statics.getPersonCh = function(query, callback){
    var Person = this;
    var personCh = require('../models/person.characteristic').PersonCh;
    Person.find(query, function(err, persons){
        if(err){
            log.error(err);
            callback(err);
        }
        async.map(persons,
            function(person, personCallback){
                //console.log(person);
                personCh.getPCh(person._id, function(errCh, ch){
                    if(errCh){
                        log.error(err);
                        callback(err);
                    }
                    var p = {
                        // _id - для внутренних нужд
                        _id: person._id,
                        id: crypto.createHash('md5').update(person._id + '').digest('hex'),
                        name: person.name,
                        job: person.job,
                        skills: person.skills,
                        characterisitics: ch
                    };
                    personCallback(null, p);
                });
            },
            function(err, personsCh){
                if(err){
                    log.error(err);
                    callback(err);
                }
                callback(null, personsCh);
            }
        );
    });
};

exports.Person = mongoose.model('Persons', schema);