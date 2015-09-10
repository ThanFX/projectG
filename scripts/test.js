var async = require('async');
var Person = require('../models/person').Person;
var Chars = require('../models/person.characteristic').PersonCh;
var log = require('../libs/log')(module);
var timeSettings = require('../models/settings').timeSettings;
var configSettings = require('../models/settings').configSettings;
var Chunks = require('../models/chunk').Chunks;
var WorldMap = require('../models/settings').worldMap;
var PersonMap = require('../models/person.maps').personMap;

var rand = function (min, max) {
    return Math.floor(min + Math.random()*(max +1 - min));
};

Person.update({_id:"55edd3dbee622bd4024e180b"}, {$inc: {"skills.0.skillLevel": "$mul:{'skills.0.skillLevel':2}"}}, function(err, row){
    if(err){
        console.log(err);
    } else {
        console.log(row);
    }
});

/*
// Взяли рыбаков
Person.getPersonCh({job: "Fishing"}, function(err, person){
    if(err){
        console.log(err);
    } else {
        console.log(person);
        //Для первого рыбака ищем чанки с доступной рыбалкой
        PersonMap.getPersonJobChunk(person.id, person.job, function(err, jobChunks){
            if(err){
                console.log(err);
            } else {
                // Если таких чанков нет
                console.log('jobChunks: ' + jobChunks);
                // Запускаем функцию разведки чанков
                exploreJobChunk(person.id);
            }
        });
    }
});
// Функция рвзведки чанков для работы
function exploreJobChunk(personId){
    PersonMap.getPersonMap(personId, function(err, personMap){
        if(err){
            console.log(err);
        } else {
            // Если вообще нет разведанных чанков - запускаем функцию разведки чанка (без параметров местности - разведка чанка, в котором находится персонаж)
            if(!personMap || personMap.maps.length == 0){
                exploreChunk(personId);
            }
        }
    });
}
// Функция без параметров местности - разведка чанка, в котором находится персонаж
function exploreChunk(personId){
    Person.getPersonCh({personId: personId}, function(err, person){

    })
}
*/




/*
var jobs = {
     "1": {
         jobName: "Лесоруб",
         skillName: "Лесорубство"
     },
     "2": {
         jobName: "Углежог",
         skillName: "Углежогство"
     },
     "3": {
         jobName: "Рыболов",
         skillName: "Рыболовство"
     },
     "4": {
         jobName: "Охотник",
         skillName: "Охота"
     },
     "5": {
         jobName: "Фермер",
         skillName: "Фермерство"
     }
};
console.log("Начинаем генерацию персонажей");
var time1 = Date.now();
*/
//Person.update({name: "Tester"}, {$inc: {"skills.0.skillLevel": 1.0}}, {multi: true}, function(err, result){
//    if(err){
//        console.log(err);
//    } else {
//        var time2 = Date.now();
//        console.log("Закончили обновление. Затрачено " + (time2 - time1)/1000 + ' секунд');
//        console.log(result);
//    }
//});
/*
var stream1 = Person.find({name:"Tester", job:"Лесоруб"}).stream();
var stream2 = Person.find({name:"Tester", job:"Углежог"}).stream();
var stream3 = Person.find({name:"Tester", job:"Рыболов"}).stream();
var stream4 = Person.find({name:"Tester", job:"Охотник"}).stream();
var stream5 = Person.find({name:"Tester", job:"Фермер"}).stream();

async.parallel({
        one: function(callback){
            stream1.on('data', function(person){
                person.skills[0].skillLevel = 4000.0;
                person.save(function(){});
            })
            .on('error', function(err){
                console.log(err);
            })
            .on('close', callback);
        },
        two: function(callback){
            stream2.on('data', function(person){
                person.skills[0].skillLevel = 4000.0;
                person.save(function(){});
            })
                .on('error', function(err){
                    console.log(err);
                })
                .on('close', callback);
        },
        three: function(callback){
            stream3.on('data', function(person){
                person.skills[0].skillLevel = 4000.0;
                person.save(function(){});
            })
                .on('error', function(err){
                    console.log(err);
                })
                .on('close', callback);
        },
        four: function(callback){
            stream4.on('data', function(person){
                person.skills[0].skillLevel = 4000.0;
                person.save(function(){});
            })
                .on('error', function(err){
                    console.log(err);
                })
                .on('close', callback);
        },
        five: function(callback){
            stream5.on('data', function(person){
                person.skills[0].skillLevel = 4000.0;
                person.save(function(){});
            })
                .on('error', function(err){
                    console.log(err);
                })
                .on('close', callback);
        }
    },
    function(err) {
        if(err){
            console.log(err);
        } else {
            var time2 = Date.now();
            console.log("Закончили обновление. Затрачено " + (time2 - time1)/1000 + ' секунд');
        }
    });
*/

//stream.on('data', function(person){
//    var p = this;
//    //p.pause();
//    //console.log(person);
//    person.skills[0].skillLevel = 3000.0;
//    person.save(function(){
//
//        //p.resume(err)
//    });
//})
//.on('error', function(err){
//    console.log(err);
//})
//.on('close', function(){
//        var time2 = Date.now();
//        console.log("Закончили обновление. Затрачено " + (time2 - time1)/1000 + ' секунд');
//});

/*
var count = 0;
async.whilst(
    function () { return count < 70000; },
    function (callback) {
        //var j = rand(1,5);
        //var s = rand(3,10); //любой крестьянин хоть чуть-чуть знает любую работу
        //var p = {
        //    name: "Tester",
        //    job: jobs[j].jobName,
        //    skills: {
        //        skillType: jobs[j].skillName,
        //        skillLevel: s
        //    }
        //};
        var stream = Model.find('*').stream();
        stream.on('data', function(person){
            person.skills[0].skillLevel *=2;
            person.save(function(err){
                if(err){
                    console.log(err);
                } else {
                    callback();
                }
            });
        });
        //Person.findOneAndUpdate({name: "Tester"}, function(err){
        //    if(err) {
        //        console.log(err);
        //    } else {
        //        count++;
        //        callback();
        //    }
        //});
    },
    function (err) {
        if(err){
            console.log(err);
        } else {
            var time2 = Date.now();
            console.log("Закончили генерацию, всего - " + count + '. Затрачено ' + (time2 - time1)/1000 + ' секунд');
        }
    }
);*/

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



/*
timeSettings.getWorldTime(function(err, wt){
    if(err){
        console.log(err);
    } else {
        console.log(wt);
        timeSettings.getTime(function (err, curTime) {
            if (err) {
                log.err(err);
            }
            console.log(curTime);
            console.log(Date.now());
            console.log(curTime.lastServerTime);
            var firstDelta = Date.now() - curTime.lastServerTime;
            console.log(firstDelta);
            var mainTimer = function () {
                timeSettings.setTime(firstDelta, function (err, curTime) {
                    if (err) {
                        log.err(err);
                    }
                    firstDelta = 0;
                    console.log(curTime);
                    timeSettings.getWorldTime(function (err1, wt1) {
                        if (err) {
                            console.log(err1);
                        } else {
                            console.log(wt1);
                        }
                    });
                    //setTimeout(mainTimer, 1000);
                });
            };
            mainTimer();
        });
    }
});
*/

/*
Chunks.getChunks('*', function(err, chunks){
    if(err){
        console.log(err);
    } else {
        console.log(chunks);
    }
});
*/
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
