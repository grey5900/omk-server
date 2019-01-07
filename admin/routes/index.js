/**
 * Created by isaac on 8/24/15.
 */

module.exports = function (app, passport) {

    require('./Admin')(app, passport);
    require('./cloth')(app, passport);
    require('./weight')(app, passport);
    require('./credit')(app, passport);
    require('./device')(app, passport);
    require('./dashboard')(app, passport);

};