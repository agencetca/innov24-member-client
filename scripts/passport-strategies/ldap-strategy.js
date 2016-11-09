var LDAPStrategy = require('passport-ldapauth');

module.exports = function(passport,config) {

    passport.use(new LDAPStrategy({
        server: {
            url: 'ldap://127.0.0.1:'+config.custom['ldap-port'],
            bindDn: 'cn='+config.administration.account,
            bindCredentials: config.administration.password,
            searchBase: 'ou=members, dc='+config.global.domain+', dc='+config.global.TLD,
            searchFilter: '(uid={{username}})'
        },
        usernameField: 'uid',
        passwordField: 'password'
    }, function(user, done) {
        return done(null, user);
    }));

}
