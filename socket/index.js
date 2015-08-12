var log = require('../libs/log')(module);
var config = require('../config');
var timeSettings = require('../models/settings').timeSettings;
var Person = require('../models/person').Person;


module.exports = function(server){

    var io = require('socket.io').listen(server);
    io.set('origins', config.get('socket.io:origins'));

	(function emitWorldDate(){
		timeSettings.getWorldTime(function(err, worldTime){
		    if(err){
		        log.err(err);
		    }
		    io.emit('worldDate', worldTime);
		    console.log(worldTime);
		});
		setTimeout(emitWorldDate, 5000);
	})();   
    (function emitPersons(query){
    	Person.getPersonCh(query, function(err, persons){
        	if(err){
            	log.error(err);
        	}
    		io.emit('persons', persons);
    	});
    	setTimeout(emitPersons, 5000);
	})('*');

    io.on('connection', function(socket){

    });
};