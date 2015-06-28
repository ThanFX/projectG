var async = require('async');
var Person = require('../models/person').Person;
var Chars = require('../models/person.characteristic').PersonCharacteristic;

var persons = [];

var rand = function (min, max) {
    return Math.floor(min + Math.random()*(max +1 - min));
};

var jobs = {
    "1": "Лесоруб",
    "2": "Углежог",
    "3": "Рыболов",
    "4": "Охотник",
    "5": "Фермер"
};

for(var i = 0; i < 99; i++){
    var p = {
        name: "Персонаж №" + i,
        job: jobs[rand(1,5)],
        skills: [
            {

            }
        ]
    };
}

Person.createPerson({name: "Тим Гарилек"}, function(err, person){
    if(err){
        console.log(err);
    }
    console.log(person);
});

/*User.createUser("Tester", "test", function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user)
    }
});*/

/*User.authorize("Tester", "test", function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user)
    }
});*/

/*User.saveJIRAParams("Tester", "login", "pass2", "http://jira.com", function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user)
    }
});*/
