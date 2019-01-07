/**
 * Created by isaac on 9/14/15.
 */

var config = require('../shared/config');
var CreditRecord = require('../../app/models/CreditRecord');

module.exports = function(app, passport) {

    var isLoggedIn = require('./auth');

    // dashboard SECTION =========================
    app.get('/credits', isLoggedIn, function(req, res) {

        CreditRecord.find({}, function (error, doc) {

            res.render('credits', {
                current_link: '/credits',
                current_view_name: '积分',
                nav : config.nav,
                table_rows: doc
            });
        });
    });
};