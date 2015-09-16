'use strict';
var configSettings = require('../models/settings').configSettings;

module.exports = new Promise((resolve, reject) => {
    configSettings.getConfig((err, config) => {
        if (err) {
            reject(err);
        }
        let period = config.checkPeriods.checkHTSEveryMinutes;
        let s = config.changeSpeed;

        let htfs = [
            {
                message: 'Состояние - сон, увеличиваем голод и жажду, обнуляем сонливость и усталость: ',
                queryString: { $and: [
                    { state: 'sleep' },
                    {'item.somnolency.value': { $lte: (-1 * (s.sleep.somnolency / period)) } },
                    {'item.fatigue.value': { $lte: (-1 * (s.sleep.fatigue / period)) } }
                ]},
                updateString: {
                    $inc: {
                        'item.hunger.value': (s.sleep.hunger / period),
                        'item.thirst.value': (s.sleep.thirst / period)
                    },
                    $set: {
                        'item.lastChangeHTSTime': '',
                        'item.fatigue.value': 0.0,
                        'item.somnolency.value': 0.0
                    }
                }
            },
            {
                message: 'Состояние - сон, увеличиваем голод и жажду, уменьшаем сонливость, обнуляем усталость: ',
                queryString: { $and: [
                    { state: 'sleep' },
                    {'item.somnolency.value': { $gt: (-1 * (s.sleep.somnolency / period)) } },
                    {'item.fatigue.value': { $lte: (-1 * (s.sleep.fatigue / period)) } }
                ]},
                updateString: {
                    $inc: {
                        'item.hunger.value': (s.sleep.hunger / period),
                        'item.thirst.value': (s.sleep.thirst / period),
                        'item.somnolency.value': (s.sleep.somnolency / period)
                    },
                    $set: {
                        'item.lastChangeHTSTime': '',
                        'item.fatigue.value': 0.0
                    }
                }
            },
            {
                message: 'Состояние - сон, увеличиваем голод и жажду, уменьшаем усталость, обнуляем сонливость: ',
                queryString: { $and: [
                    { state: 'sleep' },
                    {'item.somnolency.value': { $lte: (-1 * (s.sleep.somnolency / period)) } },
                    {'item.fatigue.value': { $gt: (-1 * (s.sleep.fatigue / period)) } }
                ]},
                updateString: {
                    $inc: {
                        'item.hunger.value': (s.sleep.hunger / period),
                        'item.thirst.value': (s.sleep.thirst / period),
                        'item.fatigue.value': (s.sleep.fatigue / period)
                    },
                    $set: {
                        'item.lastChangeHTSTime': '',
                        'item.somnolency.value': 0.0
                    }
                }
            },
            {
                message: 'Состояние - сон, увеличиваем голод и жажду, уменьшаем сонливость и усталость: ',
                queryString: { $and: [
                    { state: 'sleep' },
                    {'item.somnolency.value': { $gt: (-1 * (s.sleep.somnolency / period)) } },
                    {'item.fatigue.value': { $gt: (-1 * (s.sleep.fatigue / period)) } }
                ]},
                updateString: {
                    $inc: {
                        'item.hunger.value': (s.sleep.hunger / period),
                        'item.thirst.value': (s.sleep.thirst / period),
                        'item.fatigue.value': (s.sleep.fatigue / period),
                        'item.somnolency.value': (s.sleep.somnolency / period)
                    },
                    $set: { 'item.lastChangeHTSTime': '' }
                }
            },
            {
                message: 'Состояние - отдых, увеличиваем голод, жажду и сонливость, обнуляем усталость: ',
                queryString: { $and: [
                    { state: 'rest' },
                    {'item.fatigue.value': { $lte: (-1 * (s.rest.fatigue / period)) } }
                ]},
                updateString: {
                    $inc: {
                        'item.hunger.value': (s.rest.hunger / period),
                        'item.thirst.value': (s.rest.thirst / period),
                        'item.somnolency.value': (s.rest.somnolency / period)
                    },
                    $set: {
                        'item.lastChangeHTSTime': '',
                        'item.fatigue.value': 0.0
                    }
                }
            },
            {
                message: 'Состояние - отдых, увеличиваем голод, жажду и сонливость, уменьшаем усталость: ',
                queryString: { $and: [
                    { state: 'rest' },
                    {'item.fatigue.value': { $gt: (-1 * (s.rest.fatigue / period)) } }
                ]},
                updateString: {
                    $inc: {
                        'item.hunger.value': (s.rest.hunger / period),
                        'item.thirst.value': (s.rest.thirst / period),
                        'item.fatigue.value': (s.rest.fatigue / period),
                        'item.somnolency.value': (s.rest.somnolency / period)
                    },
                    $set: { 'item.lastChangeHTSTime': '' }
                }
            },
            {
                message: 'Состояние - домашние хлопоты, увеличиваем голод, жажду, сонливость и усталость: ',
                queryString: { $and: [ { state: 'chores' } ] },
                updateString: {
                    $inc: {
                        'item.hunger.value': (s.chores.hunger / period),
                        'item.thirst.value': (s.chores.thirst / period),
                        'item.fatigue.value': (s.chores.fatigue / period),
                        'item.somnolency.value': (s.chores.somnolency / period)
                    },
                    $set: { 'item.lastChangeHTSTime': '' }
                }
            },
            {
                message: 'Состояние - движение, увеличиваем голод, жажду, сонливость и усталость: ',
                queryString: { $and: [ { state: 'move' } ] },
                updateString: {
                    $inc: {
                        'item.hunger.value': (s.move.hunger / period),
                        'item.thirst.value': (s.move.thirst / period),
                        'item.fatigue.value': (s.move.fatigue / period),
                        'item.somnolency.value': (s.move.somnolency / period)
                    },
                    $set: { 'item.lastChangeHTSTime': '' }
                }
            },
            {
                message: 'Состояние - работа, увеличиваем голод, жажду, сонливость и усталость: ',
                queryString: { $and: [ { state: 'work' } ] },
                updateString: {
                    $inc: {
                        'item.hunger.value': (s.work.hunger / period),
                        'item.thirst.value': (s.work.thirst / period),
                        'item.fatigue.value': (s.work.fatigue / period),
                        'item.somnolency.value': (s.work.somnolency / period)
                    },
                    $set: { 'item.lastChangeHTSTime': '' }
                }
            }
        ];
        console.log(s.rest.fatigue / period);
        resolve(htfs);
    });
});
