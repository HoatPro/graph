const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'});

const node_env = process.env.NODE_ENV;

let config = {};

config.production = {
	originBackend: 'localhost:4000',
	port: 3001,
    session: {
        secret: '!@#$%^&*()',
        resave: true,
        saveUninitialized: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours 
    },
    fptAuth : {
        'clientID' 		: '948084', // your App ID
        'clientSecret' 	: 'ae3fde841a9923ae4a1efd481c259cb59f925cf6759f0068e85c0e22', // your App Secret
        'callbackURL' 	: 'https://localhost:4000/openid/callback',
        'authorizationURL': 'https://sso.csoc.fpt.net/openid/authorize',
        'tokenURL': 'https://sso.csoc.fpt.net/openid/token',
        'userInfoURL': 'https://sso.csoc.fpt.net/openid/userinfo',
        'issuer': 'https://sso.csoc.fpt.net/openid',
        'scope': 'auth_web openid profile email'
    }
};

config.development = {
	originBackend: 'localhost:4000',
    port: 3001,
    session: {
        secret: '!@#$%^&*()', 
        resave: true,
        saveUninitialized: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours 
    },
    fptAuth : {
        'clientID' 		: '948084', // your App ID
        'clientSecret' 	: 'ae3fde841a9923ae4a1efd481c259cb59f925cf6759f0068e85c0e22', // your App Secret
        'callbackURL' 	: 'https://localhost:4000/openid/callback',
        'authorizationURL': 'https://sso.csoc.fpt.net/openid/authorize',
        'tokenURL': 'https://sso.csoc.fpt.net/openid/token',
        'userInfoURL': 'https://sso.csoc.fpt.net/openid/userinfo',
        'issuer': 'https://sso.csoc.fpt.net/openid',
        'scope': 'auth_web openid profile email'
    }
};

config.environment = 'localhost';

if (~['development'].indexOf(node_env)) {
	config.environment = 'development';
}
if (~['production'].indexOf(node_env)) {
	config.environment = 'production';
}

module.exports = config;
