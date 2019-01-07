/**
 * Created by isaac on 8/26/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ClothSchema = mongoose.Schema({
    weight       : Number,
    local_id     : String,
    local_path   : String,
    type         : String,
    image        : {type: ObjectId, ref:'File'},
    thumbnail    : String,
    user         : {type: ObjectId, ref: 'User'},
    create_time  : Number,
    deleted      : { type: Boolean, default: false }
});

module.exports = mongoose.model('Cloth', ClothSchema);