var timeSettings = require('./models/settings').timeSettings;
var configSettings = require('./models/settings').configSettings;
var hub = require('./config/hub');


function getData (func) {
	return new Promise((resolve, reject) => {
		func((error, data) => {
			if (error) {
				reject(error);
			}
			resolve(data);
		});
	});
};


getData(timeSettings.getTime).then(
	result => console.log(result),
	error => console.log(error)
);