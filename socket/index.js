var log = require('../libs/log')(module);
var config = require('../config');

module.exports = function(server){
    var io = require('socket.io').listen(server);
    io.set('origins', config.get('socket.io:origins'));

    io.on('connection', function(socket){
        socket.emit('data', 'Test!');
    });
};