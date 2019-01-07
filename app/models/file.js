/**
 * Created by isaac on 8/26/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var FileSchema = mongoose.Schema({
        user         : {type: ObjectId, ref: 'User'},
        name         : String,
        path         : String,
        url          : String,
        thumbnail    : String,
        size         : Number,
        create_time  : Number,
        deleted      : { type: Boolean, default: false }
});

module.exports = mongoose.model('File', FileSchema);
