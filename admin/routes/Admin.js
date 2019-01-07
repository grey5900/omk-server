/**
 * Created by isaac on 8/24/15.
 */
var mongoose = require('mongoose');
var config = require('../shared/config');
var User =  mongoose.model('User');

module.exports = function(app, passport) {

    var isLoggedIn = require('./auth');

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', isLoggedIn, function(req, res) {
            res.redirect('/dashboard');
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/admin', isLoggedIn, function (req, res) {

        User.find({isAdmin: true}, function (error, doc) {
            res.render('admin', {
                current_link: '/admin',
                current_view_name: '管理员',
                nav : config.nav,
                table_rows: doc
            });
        });
    });


    app.get('/users', isLoggedIn, function (req, res) {

        User.find({}, function (error, doc) {

            res.render('users', {
                current_link: '/users',
                current_view_name: '用户',
                nav : config.nav,
                table_rows: doc
            });
        });
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/admin_login', passport.authenticate('admin-login', {
        successRedirect : '/dashboard', // redirect to the secure dashboard section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
};
