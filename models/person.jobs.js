'use strict';
var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var jobSchema = new Schema({
    personId: Schema.Types.ObjectId,
    type: String,
    currentLocation: Schema.Types.Mixed,
    jobLocation: Schema.Types.Mixed,
    isFinished: Boolean,
    startTime: Number,
    endTime: Number
});

var moveSchema = new Schema({
    personId: Schema.Types.ObjectId,
    job: String,
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
    let personJob = new Job(job);
    personJob.markModified('currentLocation');
    personJob.markModified('jobLocation');
    personJob.save((err) => {
        if (err) {
            console.log(err);
            if (callback) {
                callback(err);
            }
        }
    });
};

exports.PersonJobs = mongoose.model('personJob', jobSchema, 'person.jobs');
exports.PersonMoves = mongoose.model('peronMove', moveSchema, 'person.jobs');
