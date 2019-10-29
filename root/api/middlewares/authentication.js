var passport = require('passport');
var OpenIdConnectStrategy = require('passport-openidconnect').Strategy;
const _config = require('../../configs/session-config');
const config = _config[_config.environment];
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete OIDC profile is
//   serialized and deserialized.

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

process.env["HTTPS_PROXY"] = 'http://proxy.fpt.vn:80/';
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

/**
 * OpenId connect Strategy
 * @type {OpenIdConnectStrategy}
 */
var openIdConnectStrategy = new OpenIdConnectStrategy(config.fptAuth,
    function(token, tokenSecret, profile, cb) {
        // Passing profile info to callback

        let json = profile._json;
        // console.log('profile', profile);
        const username = json.nickname;
        let email = json.email;
        let fullName = json.name;

        email = email? email.toLocaleLowerCase(): `${username.toLocaleLowerCase()}@fpt.com.vn`;
        fullName = fullName? fullName: username;

        const user = {
            email: email,
            username: username,
            fullName: fullName
        };

        // console.log('user', user);

        return cb(null, user);
    }
);

passport.use(openIdConnectStrategy);

module.exports = function(app){

    app.use(passport.initialize());
    app.use(passport.session());

    //Logs the user out and redirects to the home page
    app.get('/openid/logout', function(req, res){
        // console.log('logout');
        req.logout();

        req.session.destroy(function() {
            res.redirect('https://sso.csoc.fpt.net/accounts/logout');
        });
    });


    // Used to authenticate the user - you can pass a url to redirect to after authentication as the '?redirect=' param
    app.get('/openid', function(req, res, next){
        // const query  = req.query || {};

        const authenticator = passport.authenticate('openidconnect');
        // console.log('test', count);
        // if (query) {
        //     // console.log('decode', redirect);
        //     // const decode = Buffer.from(redirect, 'hex').toString('utf8');
        //     req.session.authRedirect = query.redirect;
        //     // req.query = {};
        //
        // }
        authenticator(req, res, next);
    });

    // app.get('/openid', passport.authenticate('openidconnect'));

    //Callback url given to pingfederate team - this will redirect to the url saved by /openid if one exists
    app.get('/openid/callback',
        passport.authenticate('openidconnect', { failureRedirect: '/openid/index' }),
        function(req, res, next) {
            // console.log('/openid/callback', res.session);
            return res.redirect('/openid/index');
        });
};
