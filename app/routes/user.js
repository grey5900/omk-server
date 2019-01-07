/**
 * Created by isaac on 8/24/15.
 */
var auth = require('./auth');
var User = require('../models/user');
var Device = require('../models/device');
var CreditEngine = require('../engine/credit');
var Event = require('../../config/event');
var fs = require('fs');
var multiparty = require('multiparty');
var File = require('../models/file');
var path = require('path');
var easyimage = require('easyimage');
var Util = require('../../shared/util');
var Config = require('../../config');
var bcrypt   = require('bcrypt-nodejs');

module.exports = function(app, passport) {

    app.post('/api/login.json',
        function (req, res, next) {

            console.log(req.body);

            passport.authenticate('local-login',
                function (err, user, info) {

                    if (user){
                        user.password = undefined;

                        res.send({
                            code: 0,
                            user: user
                        });
                    }else {
                        res.send({
                            code: -1,
                            msg: info
                        });
                    }
                })(req, res, next);
        });

    app.post('/api/v1/register.json',
        function (req, res, next) {

            passport.authenticate('local-register',
                function (err, user, info) {
                    if (user) {

                        //register device if possible
                        var data = req.body.device;

                        if (typeof data !== 'undefined') {

                            data = JSON.parse(data);

                            console.log('[register]:[device]:', data, req.body);

                            var device = new Device();

                            device.manufacturer = data.manufacturer;
                            device.model =  data.model;
                            device.platform = data.platform;
                            device.uuid = data.uuid;
                            device.version = data.version;
                            device.create_time = new Date().getTime();
                            device.user = user.id;

                            device.save();
                        }

                        user.password = undefined;

                        CreditEngine(user.id, Event.register, user);

                        res.send({
                            code: 0,
                            user: user
                        });
                    }else {
                        res.send({
                            code: -1,
                            msg: info
                        });
                        console.log(err, user, info);
                    }
            })(req, res, next);
    });

    app.post('/api/v1/update_user.json',
        function (req, res, next) {

            var _fieldUpdate = function (file) {
                //normal update
                var data = req.body;
                console.log(req.body);

                var user = { };
                var keys = ['name', 'mobile', 'email', 'sex', 'stage', 'birthday'];
                for(var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    var value = data[key];
                    if (value) {
                        user[key] = value;
                    }
                }

                user.update_time = new Date().getTime();
                if (file) {
                    user.avatar = file.id;
                    user.avatar_url = file.thumbnail;
                }

                User.findOneAndUpdate({mobile: data.mobile}, user, {upsert: true},
                    function (error) {

                        if (error) {
                            console.log('update error:', error);
                            res.send({
                                code : -1,
                                msg  : 'Update failed!'
                            })
                        }else{
                            res.send({
                                code : 0,
                                user : user
                            });
                        }
                    });
            };

            var form = new multiparty.Form();

            form.parse(req, function(err, fields, files) {

                if (typeof(files) != 'undefined' && files.upfile) {

                    var array = files.upfile;

                    for (var i = 0; i < array.length; ++i) {

                        var info = array[i];

                        var name = Util.normalizeName(info.originalFilename);
                        var subpath = '/' + Util.uuid() + '-' + name;
                        var newpath = Config.UploadPath + subpath;
                        var url = Config.FileHost + subpath;

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
                            } else {

                                easyimage.thumbnail({
                                    src: newpath, dst: thumbnailSubpath,
                                    width: 88, height: 88,
                                    x: 0, y: 0
                                }).then(function () {

                                    var file = new File();

                                    file.name = name;
                                    file.path = newpath;
                                    file.url = url;
                                    file.thumbnail = thumbnail;
                                    file.create_time = new Date().getTime();

                                    file.save(function (error) {
                                        if (error) {
                                            res.send({
                                                code: -1,
                                                msg: 'Fail to save file info to db!'
                                            });
                                        } else {

                                           _fieldUpdate(file);
                                        }
                                    });

                                }, function (error) {
                                    console.log('<file:error>', error);
                                });
                            }
                        })
                    }
                }else{

                    _fieldUpdate();
                }
            });
        });

    app.post('/api/v1/user/updatePassword', function (req, res, next) {

        var mobile = req.body.mobile;
        var new_password = req.body.new_password;

        passport.authenticate('local-login',
            function (err, user, info) {

                var hash = bcrypt.hashSync(new_password, bcrypt.genSaltSync(8), null);

                User.findOneAndUpdate({mobile : mobile}, {password : hash}, {upsert: true},
                    function (error) {
                    if (error){
                        res.send({
                            code: -1,
                            msg: info
                        });
                    }else {
                        res.send({
                            code: 0
                        });
                    }
                });

            })(req, res, next);
    });

    app.get('/_api/delete_user.json', function (req, res, next) {

    });
};
