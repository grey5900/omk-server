/**
 * Created by isaac on 8/24/15.
 */
var config = require('../shared/config');
var Weight = require('../../app/models/weight');

module.exports = function(app, passport) {

    var isLoggedIn = require('./auth');

    // dashboard SECTION =========================
    app.get('/weights', isLoggedIn, function(req, res) {

        Weight.find({}, function (error, doc) {

            res.render('weights', {
                current_link: '/weights',
                current_view_name: '体重记录',
                nav : config.nav,
                table_rows: doc
            });
        });
    });
};