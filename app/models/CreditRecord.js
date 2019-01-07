/**
 * Created by isaac on 9/2/15.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var CreditRecordSchema = mongoose.Schema({
    refer_id     : String,
    operation    : String,
    amount       : Number,
    event_type   : String,
    user         : {type: ObjectId, ref: 'User'},
    create_time  : Number
});

module.exports = mongoose.model('CreditRecord', CreditRecordSchema);