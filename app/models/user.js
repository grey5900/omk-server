// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our user model
var userSchema = mongoose.Schema({

        name         : String,
        mobile       : String,
        email        : String,
        password     : String,
        stage        : Number,
        sex          : Number,
        credit       : {type: Number, default: 0},
        avatar       : {type: ObjectId, ref: 'File'},
        avatar_url   : String,
        isAdmin      : Boolean,
        birthday     : Date,
        create_time  : Number,
        update_time  : Number
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
