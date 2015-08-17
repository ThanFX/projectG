var async = require('async');
var Person = require('../models/person').Person;
var Chars = require('../models/person.characteristic').PersonCh;
var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;
var configSettings = require('../models/settings').configSettings;
var mainTimer = require('../modules/mainTimer')();

var rand = function (min, max) {
    return Math.floor(min + Math.random()*(max +1 - min));
};

for(var i = -10; i <= 10; i++){
    for(var j = -10; j <= 10; j++){
        var p = {
            "x": i,
            "y": j,
            chunkId: "123",
            isExplored: false
        };
        console.log(p);
        console.log(',');
    }
}


/*
Chars.update({state:"Сон"}, {state:"Активен"}, {multi: true}, function(err){
    if(err){
        console.log(err);
    } else {
        console.log('Обновили');
    }
});
*/

/*
//Добавление в характеристики всех персонажей новой характеристики
Person.getPersonCh('*', function(err, persons){
    if(err){
        log.error(err);
    }
    async.each(persons,
        function(person, personCallback){
            //person.characterisitics.state = 'Сон';
            /*
            var p = {
                health:
                {
                    title: 'Здоровье',
                    value: person.characterisitics.item[0].value,
                    lastChangeTime: '1'
                },
                strength:
                {
                    title: 'Сила',
                    value: person.characterisitics.item[1].value,
                    lastChangeTime: '1'
                },
                durability:
                {
                    title: 'Выносливость',
                    value: person.characterisitics.item[2].value,
                    lastChangeTime: '1'
                },
                fatigue:
                {
                    title: 'Усталость',
                    value: person.characterisitics.item[3].value,
                    lastChangeTime: '1'
                },
                hunger:
                {
                    title: 'Голод',
                    value: person.characterisitics.item[4].value,
                    lastChangeTime: '1'
                },
                thirst:
                {
                    title: 'Жажда',
                    value: person.characterisitics.item[5].value,
                    lastChangeTime: '1'
                },
                somnolency:
                {
                    title: 'Сонливость',
                    value: person.characterisitics.item[6].value,
                    lastChangeTime: '1'
                }
            };
            */
            /*
            Chars.upsertPCh(person._id, person.characterisitics.lastCheckTime, person.characterisitics.state, p, person.characterisitics.location, function(err, ch){
                if(err){
                    console.log(err);
                    log.error(err);
                }
                personCallback(null, ch);
            });
        },
        function(){
            console.log('Обновление завершено!');
        }
    );
});
*/

//var worldDate = function(){
//    timeSettings.getWorldTime(function(err, worldTime){
//        if(err){
//            log.err(err);
//        }
//        console.log(worldTime);
//    });
//    setTimeout(worldDate, 1000);
//};
//
//worldDate();

//var config = {"createWorldTime": "1400259834812"};
//console.log(config);
//
//configSettings.setConfig(config, function(err){
//     if(err){
//         log.err(err);
//     }
//});

//var jobs = {
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
//};
//console.log("Начинаем генерацию персонажей");
//var time1 = Date.now();
//var persons = [];
//for(var i = 0; i < 10000; i++){
//    var j = rand(1,5);
//    var s = rand(3,10); //любой крестьянин хоть чуть-чуть знает любую работу
//    var p = {
//        name: "Tester",
//        job: jobs[j].jobName,
//        skills: {
//           skillType: jobs[j].skillName,
//           skillLevel: s
//        }
//    };
//    persons.push(p);
//    console.log(i);
//    if((i % 1000) == 0){
//        console.log(i/1000 + '%');
//    }
//}
//var time2 = Date.now();
//console.log("Закончили генерацию, всего - " + persons.length + '. Затрачено ' + (time2 - time1)/1000 + ' секунд');
//
//
////log.info("Сохраняем характеристики");
////Person.find({"job" : {$ne: "Староста"}}, function(err, persons){
////     if(err){
////         log.err(err);
////     }
////     if(!persons){
////         log.info("Пользователи не найдены");
////     } else {
////         async.each(persons, function(person){
////             var skills = [
////                 {
////                     name: "Здоровье",
////                     value: 100
////                 },
////                 {
////                     name: "Сила",
////                     value: rand(60, 100)
////                 },
////                 {
////                     name: "Выносливость",
////                     value: rand(60, 100)
////                 },
////                 {
////                     name: "Усталость",
////                     value: 0
////                 },
////                 {
////                     name: "Голод",
////                     value: 0
////                 },
////                 {
////                     name: "Жажда",
////                     value: 0
////                 }
////             ];
////             Chars.upsertPCh(person._id, "Сон", skills, {x:0,y:0}, function(err){
////                 if(err) log.err(err);
////             });
////         }, function(err){
////             if(err) log.err(err);
////         });
////     }
////});
//
//console.log("Начинаем сохранение!");
//var time3 = Date.now();
//var pp = 0;
//async.each(persons,
//    function(person, personCallback){
//        Person.createPerson(person, function(err, personCb){
//            //if(err) console.log(err);
//            var skills = [
//                {
//                    name: "Здоровье",
//                    value: 100
//                },
//                {
//                    name: "Сила",
//                    value: rand(60, 100)
//                },
//                {
//                    name: "Выносливость",
//                    value: rand(60, 100)
//                },
//                {
//                    name: "Усталость",
//                    value: 0
//                },
//                {
//                    name: "Голод",
//                    value: 0
//                },
//                {
//                    name: "Жажда",
//                    value: 0
//                }
//            ];
//            Chars.upsertPCh(personCb._id, "test", skills, {x:0,y:0}, function(err){
//                if(err) console.log(err);
//                pp++;
//                if((pp % 10000) === 0){
//                    console.log(pp/10000 + '%');
//                }
//                personCallback(null, 1);
//            });
//        });
//    },
//    function(){
//        //if(err) log.error(err);
//        var time4 = Date.now();
//        console.log("Сохранение завершено!");
//        console.log("Закончили сохранение. Затрачено " + (time4 - time3)/1000 + " секунд");
//    }
//);



// Person.createPerson({ name: 'Персонаж №1',
//   job: 'Рыболов',
//   skills: {} }, function(err, person){
//     if(err){
//         console.log(err);
//     }
//     console.log(person);
// });
