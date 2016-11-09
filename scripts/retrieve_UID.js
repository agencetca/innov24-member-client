var ldap = require('ldapjs');
var config = require(__dirname+'/../config/main.json');
config['global'] = require(__dirname+'/../../config.json');

module.exports = function(req, res, next) {

    var client = ldap.createClient({
        url: 'ldap://127.0.0.1:'+config.custom['ldap-port']
    });

    //Bind as root to operate
    client.bind('cn='+config.administration.account, config.administration.password, function(err) {
        //assert.ifError(err);
    });

    if (req.session && req.session.uid) {

        var opts = {
            filter: '(mail='+req.body.email+')',
            scope: 'sub',
            attributes: ['userpassword']
        };

        client.search('uid='+req.session.uid+', ou=members, dc='+config.global.domain+', dc='+config.global.TLD, opts, function(err, res) {

            var entries = [];
            res.on('searchEntry', function(entry) {
                entries.push(entry.object);
            });
            res.on('searchReference', function(referral) {
            });
            res.on('error', function(err) {
                console.error('error: ' + err.message);
            });
            res.on('end', function(result) {
                if(entries.length) {
                    req.body.uid=req.session.uid;
                    req.body.password=entries[0].userpassword;
                } else {
                    req.body.uid=null;
                }
                next();
            });
        });

    } else {

        var opts = {
            filter: '(mail='+req.body.email+')',
            scope: 'sub'
        };

        client.search('ou=members, dc='+config.global.domain+', dc='+config.global.TLD, opts, function(err, res) {

            var entries = [];
            res.on('searchEntry', function(entry) {
                entries.push(entry.object);
            });
            res.on('searchReference', function(referral) {
            });
            res.on('error', function(err) {
                console.error('error: ' + err.message);
            });
            res.on('end', function(result) {
                if(entries.length) {
                    req.body.uid=entries[0].uid;
                } else {
                    req.body.uid=null;
                }
                next();
            });
        });

    }


}
