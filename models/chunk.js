var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var async = require('async');
var Schema = mongoose.Schema;

var chunkSchema = new Schema({
    x: Number,
    y: Number,
    isExplored: Boolean,
    terrains: Schema.Types.Mixed
});

chunkSchema.statics.getChunks = function(query, callback){
    this.find(query, function(err, chunks){
        if(err){
            log.error(err);
            callback(err);
        }
        callback(null, chunks);
    });
};

exports.Chunks = mongoose.model('chunk', chunkSchema, 'worldChunks');