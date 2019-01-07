/**
 * Created by isaac on 8/24/15.
 */
module.exports = function (app, passport) {

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    require('./file')(app, passport);
    require('./user')(app, passport);
    require('./cloth')(app, passport);
    require('./weight')(app, passport);
    require('./feedback')(app, passport);
    require('./sync')(app, passport);
    require('./error')(app, passport);
};