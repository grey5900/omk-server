/**
 * Created by isaac on 8/26/15.
 */
var path = require('path');

function normalizeName(name) {

    if (name && name.length > 0) {

        name = path.normalize(name);
        name = name.toLowerCase();

        var idx = name.indexOf('.jpg');
        var extLen = 4;
        if (idx === -1) {
            idx = name.indexOf('.jpeg');
            if (idx === -1) {
                idx = name.indexOf('.png');
                if (idx === -1) {
                    idx = name.indexOf('.tiff');
                    if (idx === -1) {
                        idx = name.indexOf('.gif');
                    }else{
                        extLen = 5;
                    }
                }
            }else{
                extLen = 5;
            }
        }

        if (idx === -1) {
            return name;
        }else{
            return name.substr(0, idx + extLen);
        }
    }
    return name;
}

module.exports = {
    normalizeName: normalizeName,
    uuid: function(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x100000000)
                .toString(16);
        }

        return '' + (new Date().getTime()) + '-' + s4();
    }
};