/**
 * Created by isaac on 9/2/15.
 */

var mongoose = require('mongoose');
var Feedback = require('../models/feedback');

module.exports = function(app, passport) {

    app.post('/api/feedback.json', function (req, res, next) {

        var data = req.body;
        var feedback = new Feedback();

        feedback.title = data.title;
        feedback.content = data.content;
        feedback.channel = data.channel;
        feedback.create_time = new Date().getTime();
        feedback.user = data.user;

        feedback.save(function (error) {
            if (error) {
                res.send({
                    code: -1,
                    msg: '反馈失败！'
                });
            }else{
                res.send({code: 0});
            }
        });
    });
};