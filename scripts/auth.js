//You can require other scripts to work with
var contact = require('./contact.js');

//This kind of scripts are usable as a middleware in express
module.exports = function (req, res, next) {

        contact('192.168.1.62:3030','/login','post',req,function(data) {
            res.send(data);
        }, function(error) {
            res.status(500).send('<h1>SORRY! </h1>Registration unavailable!');
        });


}
