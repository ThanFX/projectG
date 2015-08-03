var log = require('../libs/log')(module);
var config = require('../config');
var timeSettings = require('../models/settings').timeSettings;
var Person = require('../models/person').Person;


module.exports = function(server){


    var emitPerosons = function(query){
        Person.getPersonCh(query, function(err, persons){
            if(err){
                log.error(err);
            }
            io.sockets.emit('persons', persons);
        });
    };

    var io = require('socket.io').listen(server);
    io.set('origins', config.get('socket.io:origins'));

    io.on('connection', function(socket){
        //ToDo Запускается новый экземпляр таймера при рефреше клиентской странички - нужно исправить (обернуть в синглтон??)
        (function emitWorldDate(){
            timeSettings.getWorldTime(function(err, worldTime){
                if(err){
                    log.err(err);
                }
                io.sockets.emit('worldDate', worldTime);
            });
            setTimeout(emitWorldDate, 5000);
        })();
        //emitWorldDate();
        emitPerosons('*');
    });
};