var ldap = require('ldapjs');
var fs = require('fs');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;

module.exports = function(config) {

    ///--- Shared handlers

    function authorize(req, res, next) {
        /* Any user may search after bind, only cn=root has full power */
        var isSearch = (req instanceof ldap.SearchRequest);
        if (!req.connection.ldap.bindDN.equals('cn=root') && !isSearch)
            return next(new ldap.InsufficientAccessRightsError());

        return next();
    }


    ///--- Globals

    var SUFFIX = 'dc='+config.global.TLD;
    var db = {};
    var server = ldap.createServer();

    fs.stat(__dirname+'/data.json', function(err, stat) {
        if(err == null) {
            db = require(__dirname+'/data.json');
        } else {
            fs.writeFileSync(__dirname+'/data.json',JSON.stringify(db, null, 2));
        }
    });

    server.bind('cn=root', function(req, res, next) {
        if (req.dn.toString() !== 'cn=root' || req.credentials !== 'root')
            return next(new ldap.InvalidCredentialsError());

        res.end();
        return next();
    });

    server.add(SUFFIX, authorize, function(req, res, next) {
        var dn = req.dn.toString();

        if (db[dn])
            return next(new ldap.EntryAlreadyExistsError(dn));

        db[dn] = req.toObject().attributes;

        //Add save functionality
        fs.writeFileSync(__dirname+'/data.json',JSON.stringify(db, null, 2));

        res.end();
        return next();
    });

    server.bind(SUFFIX, function(req, res, next) {
        var dn = req.dn.toString();
        if (!db[dn])
            return next(new ldap.NoSuchObjectError(dn));

        if (!db[dn].userpassword)
            return next(new ldap.NoSuchAttributeError('userPassword'));

        if (db[dn].userpassword.indexOf(req.credentials) === -1)
            return next(new ldap.InvalidCredentialsError());

        res.end();
        return next();
    });

    server.compare(SUFFIX, authorize, function(req, res, next) {
        var dn = req.dn.toString();
        if (!db[dn])
            return next(new ldap.NoSuchObjectError(dn));

        if (!db[dn][req.attribute])
            return next(new ldap.NoSuchAttributeError(req.attribute));

        var matches = false;
        var vals = db[dn][req.attribute];
        for (var i = 0; i < vals.length; i++) {
            if (vals[i] === req.value) {
                matches = true;
                break;
            }
        }

        res.end(matches);
        return next();
    });

    server.del(SUFFIX, authorize, function(req, res, next) {
        var dn = req.dn.toString();
        if (!db[dn])
            return next(new ldap.NoSuchObjectError(dn));

        delete db[dn];

        //Add save functionality
        fs.writeFileSync(__dirname+'/data.json',JSON.stringify(db, null, 2));

        res.end();
        return next();
    });

    server.modify(SUFFIX, authorize, function(req, res, next) {
        var dn = req.dn.toString();
        if (!req.changes.length)
            return next(new ldap.ProtocolError('changes required'));
        if (!db[dn])
            return next(new ldap.NoSuchObjectError(dn));

        var entry = db[dn];

        for (var i = 0; i < req.changes.length; i++) {
            mod = req.changes[i].modification;
            switch (req.changes[i].operation) {
                case 'replace':
                    if (!entry[mod.type])
                        return next(new ldap.NoSuchAttributeError(mod.type));

                    if (!mod.vals || !mod.vals.length) {
                        delete entry[mod.type];
                    } else {
                        entry[mod.type] = mod.vals;
                    }

                    break;

                case 'add':
                    if (!entry[mod.type]) {
                        entry[mod.type] = mod.vals;
                    } else {
                        mod.vals.forEach(function(v) {
                            if (entry[mod.type].indexOf(v) === -1)
                                entry[mod.type].push(v);
                        });
                    }

                    break;

                case 'delete':
                    if (!entry[mod.type])
                        return next(new ldap.NoSuchAttributeError(mod.type));

                    delete entry[mod.type];

                    break;
            }
        }

        //Add save functionality
        fs.writeFileSync(__dirname+'/data.json',JSON.stringify(db, null, 2));

        res.end();
        return next();
    });

    server.search(SUFFIX, authorize, function(req, res, next) {
        var dn = req.dn.toString();
        if (!db[dn])
            return next(new ldap.NoSuchObjectError(dn));

        var scopeCheck;

        switch (req.scope) {
            case 'base':
                if (req.filter.matches(db[dn])) {
                    res.send({
                        dn: dn,
                        attributes: db[dn]
                    });
                }

                res.end();
                return next();

            case 'one':
                scopeCheck = function(k) {
                    if (req.dn.equals(k))
                        return true;

                    var parent = ldap.parseDN(k).parent();
                    return (parent ? parent.equals(req.dn) : false);
                };
                break;

            case 'sub':
                scopeCheck = function(k) {
                    return (req.dn.equals(k) || req.dn.parentOf(k));
                };

                break;
        }

        Object.keys(db).forEach(function(key) {
            if (!scopeCheck(key))
                return;

            if (req.filter.matches(db[key])) {
                res.send({
                    dn: key,
                    attributes: db[key]
                });
            }
        });

        res.end();
        return next();
    });


    ///--- Fire it up

    server.listen(config.custom['ldap-port'], function() {

        console.log('LDAP server up at: %s', server.url);

        //Ensure LDIF folder exists
        var LDIF = __dirname+'/LDIF';
        mkdirp(LDIF, function(err) { 
            // path exists unless there was an error
            if(err) console.log(err);
        });

        var TMP = LDIF+'/'+'.history';
        mkdirp(TMP, function(err) { 
            // path exists unless there was an error
            if(err) console.log(err);
        });

        //Merge every files in LDIF into one file
        var tmp_file = TMP+'/'+Date.now().toString()+'.ldif';
        exec('cat '+LDIF+'/*.ldif > '+tmp_file, function() {
            exec('ldapadd -H ldap://127.0.0.1:'+config.custom["ldap-port"]+' -x -D cn=root -w root -f '+tmp_file, function() {
                console.log('Database ready');
            }); 
        });
        
    });

}
