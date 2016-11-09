var http = require('http');
var querystring = require('querystring');

//This kind of scripts are not usable as a middleware in express
//To use a script as a middleware it MUST take the following arguments : req, res, next
module.exports = function (address,url,method,request,callback,errorHandler) {

        var data = '';

        address = address.split(":");

        var post_data = querystring.stringify(request.body);

        // An object of options to indicate where to post to
        var post_options = {
            host: address[0],
            port: address[1],
            path: url,
            method: method,
        };

        if(method.toLowerCase() === 'post') {
            post_options.headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        }

        // Set up the request
        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function (chunk) {
                if(callback)callback(data);
            });
        });

        post_req.on('error', function (error) {
            if(errorHandler) errorHandler(error);
            console.log('ERROR : '+error);
        });

        // post the data
        post_req.write(post_data);
        post_req.end();

}
