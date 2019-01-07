/**
 * Created by isaac on 8/26/15.
 */
var Weight = require('../models/weight');
var CreditEngine = require('../engine/credit');
var Event = require('../../config/event');

module.exports = function (app, passport) {

    app.post('/api/v1/weight.json', function (req, res, next) {

        var data = req.body;
        var weight = new Weight();

        weight.cloth = data.cloths;
        weight.type = data.type;
        weight.create_time = new Date().getTime();
        weight.user = data.sid || data.user;
        weight.local_id = data.local_id;
        weight.pure_weight = data.pure_weight;
        weight.weight = data.weight;
        weight.cloth_weight = data.cloth_weight;

        console.log('add_weight:', weight);

        weight.save(function (error) {
            if (error) {
                res.send({
                    code: -1,
                    msg: 'Fail to delete cloth!'
                });
            } else {

                CreditEngine(weight.user, Event.add_weight, weight);

                res.send({code: 0});
            }
        });
    });

    app.post('/api/v1/update_weight.json', function (req, res, next) {

        var info = req.body;
        var local_id = info.local_id;

        Weight.update({local_id: local_id},
            {$set: {
                cloth: info.cloths,
                type: info.type,
                weight: info.weight,
                pure_weight: info.pure_weight,
                cloth_weight: info.cloth_weight
            }},
            function (error) {
                if (error) {
                    console.log('[update_weight]:[error]', error, info);
                    res.send({
                        code: -1,
                        msg: 'Fail to delete cloth!'
                    });
                } else {
                    res.send({code: 0});
                }
            });
    });

    app.delete('/api/v1/weight.json', function (req, res, next) {

        var id = req.body.id;

        Weight.update({local_id: id},
            {$set: {deleted: true}},
            function (error) {
                if (error) {
                    res.send({
                        code: -1,
                        msg: 'Fail to delete cloth!'
                    });
                } else {
                    res.send({code: 0});
                }
            });
    });

};