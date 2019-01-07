/**
 * Created by isaac on 8/24/15.
 */
var config = require('../shared/config');
var Device = require('../../app/models/device');

module.exports = function(app, passport) {

    var isLoggedIn = require('./auth');

    // dashboard SECTION =========================
    app.get('/devices', isLoggedIn, function(req, res) {

        Device.find({}, function (error, doc) {

            res.render('devices', {
                current_link: '/devices',
                current_view_name: '设备',
                nav : config.nav,
                table_rows: doc
            });
        });
    });
};