var async = require('async');
var Person = require('../models/person').Person;
var Chars = require('../models/person.characteristic').PersonCh;
var log = require('../libs/log')(module);

//var persons = [];

var rand = function (min, max) {
    return Math.floor(min + Math.random()*(max +1 - min));
};

var time = function() {
    var startTime = new Date();
    console.log(startTime);
}

var mainTimer = setInterval(time, 1000);



//var mainTimet = setInterval(function(){})

// var jobs = {
//     "1": {
//         jobName: "Лесоруб",
//         skillName: "Лесорубство"
//     },
//     "2": {
//         jobName: "Углежог",
//         skillName: "Углежогство"
//     },
//     "3": {
//         jobName: "Рыболов",
//         skillName: "Рыболовство"
//     },
//     "4": {
//         jobName: "Охотник",
//         skillName: "Охота"
//     },
//     "5": {
//         jobName: "Фермер",
//         skillName: "Фермерство"
//     }
// };

//for(var i = 0; i < 99; i++){
//    var j = rand(1,5);
//    var s = rand(3,10); //любой крестьянин хоть чуть-чуть знает любую работу
//    var p = {
//        name: "Персонаж №" + i,
//        job: jobs[j].jobName,
//        skills: {
//           skillType: jobs[j].skillName,
//           skillLevel: s
//        }
//    };
//    persons.push(p);
//}

// log.info("Сохраняем характеристики");
// Person.find({"job" : {$ne: "Староста"}}, function(err, persons){
//     if(err){
//         log.err(err);
//     }
//     if(!persons){
//         log.info("Пользователи не найдены");
//     } else {
//         async.each(persons, function(person){
//             var skills = [
//                 {
//                     name: "Здоровье",
//                     value: 100
//                 },
//                 {
//                     name: "Сила",
//                     value: rand(60, 100)
//                 },
//                 {
//                     name: "Выносливость",
//                     value: rand(60, 100)
//                 },
//                 {
//                     name: "Усталость",
//                     value: 0
//                 },
//                 {
//                     name: "Голод",
//                     value: 0
//                 },
//                 {
//                     name: "Жажда",
//                     value: 0
//                 }
//             ];
//             Chars.upsertPCh(person._id, "Сон", skills, {x:0,y:0}, function(err){
//                 if(err) log.err(err);
//             });
//         }, function(err){
//             if(err) log.err(err);
//         });
//     }
// });

//log.info("Начинаем сохранение!");
//async.each(persons, function(person){
//    Person.createPerson(person, function(err, personCb){
//        if(err) console.log(err);
//    });
//}, function(err){
//    if(err) console.log(err);
//    log.info("Сохранение завершено!");
//});



// Person.createPerson({ name: 'Персонаж №1',
//   job: 'Рыболов',
//   skills: {} }, function(err, person){
//     if(err){
//         console.log(err);
//     }
//     console.log(person);
// });

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
