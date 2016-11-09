var express = require("express");
var app = express();
var path = require('path');

module.exports = function (config) {

    var SERV_PORT = 10102;
    app.use(express.static(__dirname + '/apps/member'));

    app.listen(SERV_PORT, function() {
        console.log("APPSERV is listening on " + SERV_PORT);
    });

}
