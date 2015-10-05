'use strict';
var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var jobSchema = new Schema({
    personId: Schema.Types.ObjectId,
    type: String,
    state: String,
    action: String,
    stage: String,
    startTime: Number,
    endTime: Number
});

var moveSchema = new Schema({
    personId: Schema.Types.ObjectId,
    type: String,
    state: String,
    moveFrom: {
        _id: false,
        x: Number,
        y: Number
    },
    moveTo: {
        _id: false,
        x: Number,
        y: Number
    },
    stage: String,
    startTime: Number,
    endTime: Number
});

jobSchema.statics.createJob = (job, callback) => {
    let Job = mongoose.model('person.jobs', jobSchema);
    let job = new Job({
        personId: job.personId,
        type: job.type,
        startTime: job.startTime
    });
};

exports.PersonJobs = mongoose.model('person.jobs', jobSchema);
exports.PersonMoves = mongoose.model('person.jobs', moveSchema);
