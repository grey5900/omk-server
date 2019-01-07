/**
 * Created by isaac on 8/26/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var FeedbackSchema = mongoose.Schema({
    title        : String,
    content      : String,
    channel      : String,
    user         : {type: ObjectId, ref: 'User'},
    create_time  : Number,
    deleted      : { type: Boolean, default: false }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);