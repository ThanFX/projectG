var log = require('../libs/log')(module);
var config = require('../config');
var timeSettings = require('../models/settings').timeSettings;
// var WorldMap = require('../models/settings').worldMap;
var Chunks = require('../models/chunk').Chunks;
var Person = require('../models/person').Person;

module.exports = function (server) {
    var io = require('socket.io').listen(server);
    io.set('origins', config.get('socket.io:origins'));

    function emitChunks (socket) {
        Chunks.getChunks('*', function (err, chunks) {
            if (err) {
                log.err(err);
                console.log(err);
            } else {
                socket.emit('chunks', chunks);
            }
        });
    }

    (function emitWorldDate () {
        timeSettings.getWorldTime(function (err, worldTime) {
            if (err) {
                log.err(err);
            }
            io.emit('worldDate', worldTime);
        });
        setTimeout(emitWorldDate, 5000);
    })();
    /*
    (function emitPersons (query) {
        Person.getPersonCh (query, function (err, persons) {
            if (err) {
                log.error(err);
            }
            io.emit('persons', persons);
        });
        setTimeout(emitPersons, 5000);
    })('*');
    */
    function emitAllPersons (socket) {
        Person.getPersonCh('*', function (err, persons) {
            if (err) {
                log.error(err);
            }
            socket.emit('persons', persons);
        });
    }

    io.on('connection', function (socket) {
        socket.on('getChunks', function () {
            emitChunks(socket);
        });
        socket.on('getAllPersons', function () {
            emitAllPersons(socket);
        });
        socket.on('getPerson', function (personId) {
            Person.getPersonCh({_id: personId}, function (err, person) {
                if (err) {
                    log.error(err);
                    console.log(err);
                } else {
                    socket.emit('person', person);
                }
            });
        });
    });
};