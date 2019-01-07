/**
 * Created by isaac on 8/26/15.
 */
var Util = require('../../shared/util');
var Config = require('../../config');
var fs = require('fs');
var multiparty = require('multiparty');
var File = require('../models/file');
var path = require('path');
var easyimage = require('easyimage');

module.exports = function (app, passport) {

    app.post('/api/file.json', function (req, res, next) {

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
                                }else{
                                    res.send({
                                        code:0,
                                        id : file.id,
                                        url: url,
                                        thumbnail: thumbnail
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
};