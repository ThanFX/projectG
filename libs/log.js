var winston = require('winston');
require('winston-logstash');

var ENV = process.env.NODE_ENV;

function getLogger(module) {
    //Выводим только файл и папку из полного пути
    var path = module.filename.split('\\').splice(-2).join('\\');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                //port: 28777,
                //node_name: 'G',
                //host: '127.0.0.1'
                colorize: true,
                //level: ENV == 'development' ? 'debug' : 'error',
                level: 'development',
                label: path,
                timestamp: true
            })
        ]
    });
}

module.exports = getLogger;