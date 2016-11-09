var express = require("express");
var app = express();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(bodyParser());


module.exports = function(config) {

    var SERV_PORT = 9090;

    var pg = require('pg');

    // create a config to configure both pooling behavior
    // and client options
    // note: all config is optional and the environment variables
    // will be read if the config is not present
    var config = {
        user: 'postgres', //env var: PGUSER
        database: 'postgres', //env var: PGDATABASE
        password: 'postgres', //env var: PGPASSWORD
        host: 'localhost', // Server hosting the postgres database
        port: 5432, //env var: PGPORT
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };

    //this initializes a connection pool
    //it will keep idle connections open for a 30 seconds
    //and set a limit of maximum 10 idle clients
    var pool = new pg.Pool(config);

    app.post("/", function(req, res) {

        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            //client.query('SELECT $1::int AS number', ['1'], function(err, result) {
            client.query("INSERT INTO news (title,chapo,content,publication_date) VALUES ('"+req.body.title+"','"+req.body.desc+"','"+req.body.content+"', '2016-10-02')", [], function(err, result) {
                //call `done()` to release the client back to the pool
                //
                done();

                if(err) {
                    return console.error('error running query', err);
                }
                //console.log(result.rows);
                console.log("published : "+JSON.stringify(req.body));
                res.send('steps here');
                //res.send('OK NOW PROVIDE A REQUEST -_-');
                //output: 1
            });
        });

        pool.on('error', function (err, client) {
            // if an error is encountered by a client while it sits idle in the pool
            // the pool itself will emit an error event with both the error and
            // the client which emitted the original error
            // this is a rare occurrence but can happen if there is a network partition
            // between your application and the database, the database restarts, etc.
            // and so you might want to handle it and at least log it out
            console.error('idle client error', err.message, err.stack)
        })


    });

    app.get("/", function(req, res) {
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            //client.query('SELECT $1::int AS number', ['1'], function(err, result) {
            client.query("SELECT * from news", [], function(err, result) {
                //call `done()` to release the client back to the pool
                //
                done();

                if(err) {
                    return console.error('error running query', err);
                }
                console.log(result.rows);
                res.send(result.rows);
                //res.send('OK NOW PROVIDE A REQUEST -_-');
                //output: 1
            });
        });

        pool.on('error', function (err, client) {
            // if an error is encountered by a client while it sits idle in the pool
            // the pool itself will emit an error event with both the error and
            // the client which emitted the original error
            // this is a rare occurrence but can happen if there is a network partition
            // between your application and the database, the database restarts, etc.
            // and so you might want to handle it and at least log it out
            console.error('idle client error', err.message, err.stack)
        })
    });

    app.listen(SERV_PORT, function() {
        console.log("Listening on " + SERV_PORT);
    });

}
