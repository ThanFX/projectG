var log = require('../libs/log')(module);
var config = require('../config');
var timeSettings = require('../models/settings').timeSettings;


module.exports = function(server){
    
	var worldDate = function(){
	    timeSettings.getWorldTime(function(err, worldTime){
	        if(err){
	            log.err(err);
	        }
	        io.sockets.emit('worldDate', worldTime);
	    });
	};

    var io = require('socket.io').listen(server);
    io.set('origins', config.get('socket.io:origins'));

    io.on('connection', function(socket){
        var emitWorldDate = function(){
        	worldDate();
        	setTimeout(emitWorldDate, 5000);
    	}
    	emitWorldDate();
    });
};