/**
 * Created by Xie on 2017/5/22.
 */
var http = require('http');
var sendHttp={
    get:function (url,callback) {
        http.get(url, function(ress) {
            callback(ress.text);
        }).on('error', function(e) {
            callback(e.message);
        });
    }
};
module.exports = sendHttp;