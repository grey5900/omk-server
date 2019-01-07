/**
 * Created by isaac on 8/26/15.
 */

var uploadPath = __dirname + '/public/uploads';
var port = 3030;
var host = 'http://api.ohmygod.tech:' + port;

module.exports = {
    Port : port,
    Host: host,
    UploadPath : uploadPath,
    ThumbnailPath: __dirname + '/public/thumbnails',
    FileHost : host + '/uploads',
    ThumbnailFolder : '/thumbnails'
};