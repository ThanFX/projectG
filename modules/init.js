'use strict';
var hub = require('../config/hub');
var timeSettings = require('../models/settings').timeSettings;
var configSettings = require('../models/settings').configSettings;
var mainTimer = require('../modules/mainTimer');
var checkStates = require('../modules/personStates');
var checkWorks = require('../modules/personWorks');
var log = require('../libs/log')(module);
var lib = require('../libs');

module.exports = () => {
    lib.getData(timeSettings.getWorldTime).then(
        time => {
            hub.time = time;
            return lib.getData(configSettings.getConfig);
        }
    ).then(
        config => {
            hub.config = config;
            // Пустой промис, чтобы следующий шаг начался только после выполнения текущего!
            return new Promise((resolve) => resolve());
        }
    ).then(() => mainTimer()
    ).then(() => checkStates()
    // ).then(() => checkWorks()
    ).catch(
        error => {
            log.error(error);
            console.log(error);
        }
    );
};