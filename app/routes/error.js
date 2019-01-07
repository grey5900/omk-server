/**
 * Created by isaac on 8/25/15.
 */
module.exports = function (app, passport) {
    // Handle 404
    app.use(function(req, res) {
        res.status(400);
        res.send('400');
    });

    // Handle 500
    app.use(function(error, req, res, next) {
        console.log(error);
        res.status(500);
        res.send('500');
    });
};