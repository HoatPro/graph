var config = {};
var path = require('fs');

config.development = {

    application: {
        address: 'https://127.0.0.1:44301',
        listenInterface: '127.0.0.1',
        host: 'https://localhost',
        port: 4000,
        session: {
            secret: '!@#$%^&*()',
            resave: true,
            saveUninitialized: true
        }
    },

    mysql: {
        connectionLimit : 500,
        host: "172.27.131.188",
        user: "ast",
        password: "nocast@123",
        database: "hsg"
    },
    // mysql: {
    //     connectionLimit : 500,
    //     host: "172.27.131.238",
    //     user: "root",
    //     password: "Hx9a8pzWnU8FdT5x",
    //     database: "connect"
    // },

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

config.production = {
    application: {
        address: 'https://127.0.0.1:3001',
        listenInterface: '127.0.0.1',
        port: 4000,
        session: {
            secret: '!@#$%^&*()',
            resave: true,
            saveUninitialized: true
        }
    },
    mysql: {
        connectionLimit : 500,
        host: "localhost",
        user: "root",
        password: "Hx9a8pzWnU8FdT5x",
        database: "hsg"
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

config.environment = 'development';

if (path.existsSync(__dirname + '../production.txt')){
    config.environment = 'production';
}

console.log('ENV', config.environment, JSON.stringify(config[config.environment]));

module.exports = config;