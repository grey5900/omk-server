/**
 * Created by isaac on 8/24/15.
 */
var config = require('../shared/config');

module.exports = function(app, passport) {

	var fs = require('fs');
    var isLoggedIn = require('./auth');

    // dashboard SECTION =========================
    app.get('/dashboard', isLoggedIn, function(req, res) {

        console.log(req);

        res.render('dashboard', {
            current_link: '/dashboard',
            user : req.user,
            nav : config.nav
        });
    });
};