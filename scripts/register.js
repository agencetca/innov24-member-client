var ldap = require('ldapjs');
var assert = require('assert');
var Guid = require('guid');
var ssha = require('node-ssha256');

module.exports = function (req,config,callback) {
    
    var client = ldap.createClient({
        url: 'ldap://127.0.0.1:'+config.custom['ldap-port']
    });

    //Bind as root to operate
    client.bind('cn='+config.administration.account, config.administration.password, function(err) {
          assert.ifError(err);
    });

    //Get user data
    var cn = req.body.email; //user identifier
    var sn = req.body.username; //username
    var email = req.body.email; //email address
    var role = req.body.role; //email address
    var userPassword = req.body.password; //user password

    //Verification on data TODO

    //Search for existing user
    
    var uid = Guid.raw();

    function success() {
        //Prepare entry insertion
        var entry = {
            uid: uid,
            cn: cn,
            sn: sn,
            mail: email,
            userPassword: userPassword,
            objectclass: 'inetOrgPerson'
        };

        //console.log(require(__dirname+'/../subserv/data.json'));

        //Present data to LDAP
        client.add('uid='+uid+', ou=members, dc='+config.global.domain+', dc='+config.global.TLD, entry, function(err) {

            if(err) console.log(err);

            var change = new ldap.Change({
                operation: 'add',
                modification: {
                    member: ['uid='+uid+', ou=members, dc='+config.global.domain+', dc='+config.global.TLD]
                }
            });

            client.modify('cn='+config.global.roles[role]+', ou=roles, dc='+config.global.domain+', dc='+config.global.TLD, change, function(err) {
                (err) ? callback(false) : callback(true);
            })

        });
    }

    function failure() {
        callback(false);
    }

    var opts = {
        filter: '(mail='+email+')',
        scope: 'sub',
        //attributes: ['*']
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
            if(!entries.length) {
                success();
            } else {
                failure();
            }
        });
    });


}
