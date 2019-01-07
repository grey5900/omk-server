/**
 * Created by isaac on 8/26/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var DeviceSchema = mongoose.Schema({
    manufacturer       : String,
    model              : String,
    platform           : String,
    uuid               : String,
    version            : String,
    create_time        : Number,
    user               : {type: ObjectId, ref: 'User'},
    deleted            : { type: Boolean, default: false }
});

module.exports = mongoose.model('Device', DeviceSchema);

