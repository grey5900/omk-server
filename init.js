/**
 * Created by isaac on 9/3/15.
 */
var Admin = require('./app/models/user');

function _addAdmin() {
    var user = new Admin();
    user.email = 'lxm@omk.io';
    user.password = user.generateHash('1qaz!QAZ');
    user.create_time = new Date();
    user.mobile = '13671765129';
    user.name = '完颜元';
    user.isAdmin = true;
    user.save();
}

module.exports = function () {
    _addAdmin();
};

