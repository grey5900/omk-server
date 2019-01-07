/**
 * Created by isaac on 8/26/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var WeightSchema = mongoose.Schema({
    user         : {type: ObjectId, ref: 'User'},
    local_id     : String,
    weight       : Number,
    type         : Boolean,
    cloth        : [String],
    cloth_weight : Number,
    pure_weight  : Number,
    create_time  : Number,
    deleted      : { type: Boolean, default: false }
});

module.exports = mongoose.model('Weight', WeightSchema);