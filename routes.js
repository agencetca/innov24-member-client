const passport = require('passport');
const httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
    //proxyTimeout : 3000
});
const request = require('request');

module.exports = function(app,config,scripts) {

    var address = config.global.address;

    app.post('/remote-register', function(req, res) {
        scripts.contact(address.authserv,'/register','post',req,function(data) {
            res.send(data);
        }, function(error) {
            res.status(500).send('<h1>SORRY! </h1>Registration unavailable!');
        });
    });

    app.post('/remote-login', function(req, res) {
        scripts.contact(address.authserv,'/login','post',req,function(data) {
            res.send(data);
        }, function(error) {
            res.status(500).send('<h1>SORRY! </h1>Login unavailable!');
        });
    });

    app.post('/login', scripts.retrieve_UID, passport.authenticate('ldapauth', {session: false}), function(req, res) {
        req.session.logged = true;
        res.redirect('/online');
    });

    app.get('/logout', function(req, res) {
        req.session.logged = false;
        res.redirect('/#');
    });

    app.get('/*', function(req, res) {
        if(req.url === '/online') req.url='';
        if(req.session.logged === true) {
            proxy.web(req, res, { target: 'http://127.0.0.1:10102' });
        } else {
            res.redirect('/#login');
        }
    });

    app.post('/register', function(req, res) {
        scripts.register(req, config, function(answer) {
            if(answer === true) {
                console.log(req.body.email+' has been successfully registered. Welcome!');
                res.redirect('/#login');
            } else {
                res.write('<script>setTimeout(function(){window.location = "/#register"},1000)</script>');
                res.end('Sorry, '+req.body.email+' is not available');
            }
        });
    });

};

