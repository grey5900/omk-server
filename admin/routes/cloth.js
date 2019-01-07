/**
 * Created by isaac on 8/24/15.
 */
var config = require('../shared/config');
var Cloth = require('../../app/models/cloth');

module.exports = function(app, passport) {

    var isLoggedIn = require('./auth');

    // dashboard SECTION =========================
    app.get('/clothes', isLoggedIn, function(req, res) {

        Cloth.find({}, function (error, doc) {

            res.render('clothes', {
                current_link: '/clothes',
                current_view_name: '衣物',
                nav : config.nav,
                table_rows: doc
            });
        });
    });
};