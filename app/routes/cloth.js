/**
 * Created by isaac on 8/26/15.
 */

var mongoose = require('mongoose');
var fs = require('fs');
var multiparty = require('multiparty');
var Util = require('../../shared/util');
var Config = require('../../config');
var Cloth = require('../models/cloth');
var easyimage = require('easyimage');
var File = require('../models/file');

var CreditEngine = require('../engine/credit');
var Event = require('../../config/event');

module.exports = function (app, passport) {

    app.post('/api/v1/add_cloth.json', function (req, res, next) {

        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
            var array = files.upfile;

            for(var i = 0; i < array.length; ++i) {

                var info = array[i];

                var name = Util.normalizeName(info.originalFilename);
                var subpath = '/' + Util.uuid() + '-' + name;
                var newpath = Config.UploadPath + subpath;
                var url =  Config.FileHost + subpath;

                var thumbnailName = '/' + Util.uuid() + '-thumb-' + name;
                var thumbnailSubpath = Config.ThumbnailPath + thumbnailName;
                var thumbnail = Config.ThumbnailFolder + thumbnailName;

                console.log('new path: ' + newpath + ' url: ' + url);

                fs.rename(info.path, newpath, function (error) {
                    if (error) {
                        console.log(error);

                        res.status(500);
                        res.send({
                            code: -1,
                            msg: 'Fail to upload file!'
                        })
                    }else{

                        easyimage.thumbnail({
                            src:newpath, dst: thumbnailSubpath,
                            width: 88, height: 88,
                            x:0, y:0
                        }).then(function () {

                            var file = new File();
                            var create_time = new Date().getTime();
                            file.name = name;
                            file.path = newpath;
                            file.url = url;
                            file.thumbnail = thumbnail;
                            file.create_time = create_time;

                            file.save(function (error) {
                                if (error) {
                                    res.send({
                                        code: -1,
                                        msg: 'Fail to save file info to db!'
                                    });
                                }else{

                                    var cloth = new Cloth();

                                    cloth.type = fields.type;
                                    cloth.weight = parseFloat(fields.weight);
                                    cloth.create_time = create_time;
                                    cloth.image = file.id;
                                    cloth.thumbnail = thumbnail;
                                    cloth.local_id = fields.local_id;
                                    cloth.user = fields.user;
                                    cloth.local_path = fields.local_path;

                                    console.log('[add cloth v2]:', cloth, fields);

                                    cloth.save(function (error) {
                                        if (error) {
                                            res.send({
                                                code: -1,
                                                msg: 'Fail to add cloth!'
                                            });
                                        } else {

                                            CreditEngine(cloth.user, Event.add_cloth, cloth);
                                            res.send({
                                                code: 0,
                                                thumbnail : thumbnail,
                                                image: file.id
                                            });
                                        }
                                    });
                                }
                            });

                        }, function (error) {
                            console.log('<file:error>', error);
                        });
                    }
                })
            }
        });
    });

    app.post('/api/add_cloth.json', function (req, res, next) {

        var data = req.body;
        var cloth = new Cloth();

        cloth.type = data.type;
        cloth.weight = data.weight;
        cloth.create_time = new Date().getTime();
        cloth.image = data.image;
        cloth.thumbnail = data.thumbnail;
        cloth.local_id = data._id;
        cloth.user = data.sid || data.user;
        cloth.local_path = data.local_path;

        cloth.save(function (error) {
            if (error) {
                res.send({
                    code: -1,
                    msg: 'Fail to add cloth!'
                });
            } else {

                CreditEngine(cloth.user, Event.add_cloth, cloth);

                res.send({code: 0});
            }
        });
    });

    app.post('/api/v1/update_cloth.json', function (req, res, next) {

        var info = req.body;
        var cloth_id = info.id;

        Cloth.update({local_id: cloth_id},
            {$set: {
                weight: info.weight
            }},
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

    app.delete('/api/v1/delete_cloth.json', function (req, res, next) {

        var cloth_id = req.body.id;

        Cloth.update({local_id: cloth_id},
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