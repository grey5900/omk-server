/**
 * Created by isaac on 8/26/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Cloth = require('../models/cloth');
var Weight = require('../models/weight');
var File = require('../models/file');
var User =  mongoose.model('User');

module.exports = function (app, passport) {

    app.post('/api/sync_records.json', function (req, res, next) {

        var array = req.body.data;
        var result = [];

        if (typeof array !== "undefined") {
            for (var i = 0; i < array.length; ++i) {
                var info = array[i];
                var data = info.data;

                switch (info.action) {

                    case 'remove_cloth':
                    {
                        result.push(data);
                        Cloth.update({local_id: data}, {$set: {deleted: true}});
                        break;
                    }
                    case 'update_cloth':
                    {
                        result.push(data);
                        Cloth.update({local_id: data.id}, {$set: data});
                        break;
                    }
                    case 'remove_weight':
                    {
                        result.push(data);
                        Weight.update({local_id: data}, {$set: {deleted: true}});
                        break;
                    }
                    case 'update_weight':
                    {
                        result.push(data);
                        Weight.update({local_id: data.id}, {$set: data});
                        break;
                    }
                    default :
                    {
                        break;
                    }
                }
            }

            console.log(array, result);
        }

        var cloths = req.body.cloths;
        if (typeof cloths !== "undefined") {
            for (var i = 0; i < cloths.length; ++i) {
                var clooper = cloths[i];
                Cloth.update({local_id : clooper.local_id},
                    clooper, {upsert: true}, function (error) {
                        if (error) {
                            console.log(error);
                        }
                    });
            }
        }

        var weights = req.body.weights;
        if (typeof weights !== "undefined") {
            for (var i = 0; i < weights.length; ++i) {
                var wlooper = weights[i];
                Weight.update({local_id : wlooper.local_id},
                    wlooper, {upsert: true}, function (error) {
                        if (error) {
                            console.log(error);
                        }
                    });
            }
        }

        res.send({
            code: 0,
            data: result
        });

    });

    app.get('/api/sync.json', function (req, res, next) {

        var info = req.query;
        var date = info.last_update;
        var user = info.user;
        if (!user || user.length != 24) {
            res.send({
                code: -1,
                msg: 'Missing user id!'
            });
            return;
        }

        var user_id = ObjectId(user);

        if (!user_id) {
            res.send({
                code: -1,
                msg: 'Missing user id!'
            });
            return;
        }

        var result = {
            clothes: [],
            weights: []
        };

        if (date) {
            date = new Date(date);
        } else {
            date = new Date(0);
        }

        Cloth.find({
            'user': user,
            'create_time': {'$gte': date},
            deleted: false
        }).select('-__v')
            .exec(function (err, clothes) {

                if (err) {
                    res.send(err);
                } else {

                    clothes.forEach(function (cloth) {
                        delete cloth.__v;
                        result.clothes.push(cloth);
                    });

                    Weight.find({
                        'user': user,
                        'create_time': {'$gte': date},
                        deleted: false
                    }).select('-__v')
                        .exec(function (err, weights) {
                            console.log(weights);

                            if (err) {
                                res.send(err);
                            } else {

                                weights.forEach(function (weight) {
                                    delete weight.__v;
                                    result.weights.push(weight);
                                });

                                res.send({
                                    code: 0,
                                    last_update: new Date().getTime(),
                                    data: result
                                })
                            }
                        });
                }
            });
    });

    app.get('/api/sync_user.json', function (req, res, next) {

        console.log('ok');

        var info = req.query;
        var user = info.user;
        if (!user || user.length != 24) {
            res.send({
                code: -1,
                msg: 'Missing user id!'
            });
            return;
        }

        var user_id = ObjectId(user);

        if (!user_id) {
            res.send({
                code: -1,
                msg: 'Missing user id!'
            });

        }else{

            User.findOne({_id: user_id},
                function (error, doc) {
                    if (error) {
                        res.send({
                            code : -1,
                            msg : error
                        });
                    }else{
                        if (doc) {
                            var user = doc.toObject();
                            user.password = undefined;
                            res.send({
                                code: 0,
                                data: user
                            });
                        }else{
                            res.send({
                                code : -1,
                                msg : 'User not found'
                            })
                        }
                    }
            });
        }

    });

};