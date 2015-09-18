'use strict';
var hub = require('../config/hub');
var timeSettings = require('../models/settings').timeSettings;
var configSettings = require('../models/settings').configSettings;
var mainTimer = require('../modules/mainTimer');
var checkStates = require('../modules/personStates');
var checkWorks = require('../modules/personWorks');
var log = require('../libs/log')(module);

module.exports = function () {
    getData(timeSettings.getWorldTime).then(
        time => {
            hub.time = time;
            return getData(configSettings.getConfig);
        }
    ).then(
        config => hub.config = config
    ).then(
            mainTimer()
    ).then(
        checkStates()
    ).then(
        checkWorks()
    ).catch(
        error => {
            log.error(error);
            console.log(error);
        }
    );


    function getData (func) {
        return new Promise((resolve, reject) => {
            func((error, data) => {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        });
    }
};