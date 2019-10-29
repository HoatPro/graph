const fs = require('fs');

let config = {};

config.production = {
    elasticsearch: {
        url: 'http://localhost:9200',
        host: 'localhost',
        port: '9200',
        requestTimeout: 120000
    },
    mysql: {
        connectionLimit: 500,
        host: "172.27.131.188",
        user: "ast",
        password: "nocast@123",
        database: "raca_new"
    },
    redis: {
        host: 'localhost',
        port: '6379',
        ttl: 86400, //expiration in seconds,
        secret: '!@#$%^&*()',
        cookie: {
            // secure: true,
            httpOnly: true,
            maxAge: 86400000, // 1 day
        },
    },
    app: {
        port: 4000,
        host: 'localhost',
    },
    fptAuth: {
        'clientID': '569079', // your App ID
        'clientSecret': '9a6569a3b826366e317e9fa85fc974ae5ed69c23aaef2ecce0155a37', // your App Secret
        'callbackURL': 'https://ast.fpt.net/openid/callback',
        'authorizationURL': 'https://sso.csoc.fpt.net/openid/authorize',
        'tokenURL': 'https://sso.csoc.fpt.net/openid/token',
        'userInfoURL': 'https://sso.csoc.fpt.net/openid/userinfo',
        'issuer': 'https://sso.csoc.fpt.net/openid',
        'scope': 'auth_web openid profile email',
        'state': true
    },
    originFrontend: 'https://ast.fpt.net/raca/'
};

config.development = {
    elasticsearch: {
        url: 'http://172.27.229.69:9210',
        host: '172.27.229.69',
        port: '9210',
        requestTimeout: 120000
    },
    mysql: {
        connectionLimit: 500,
        host: "172.27.131.188",
        user: "ast",
        password: "nocast@123",
        database: "raca_new"
    },
    redis: {
        host: 'localhost',
        port: '6379',
        ttl: 86400, //expiration in seconds,
        secret: '!@#$%^&*()',
        cookie: {
            secure: true,
            // httpOnly: true,
            // maxAge: 86400000, // 1 day
        },
    },
    app: {
        port: 4000,
        host: 'localhost',
    },
    fptAuth: {
        'clientID': '948084', // your App ID
        'clientSecret': 'ae3fde841a9923ae4a1efd481c259cb59f925cf6759f0068e85c0e22', // your App Secret
        'callbackURL': 'https://localhost:4000/openid/callback',
        'authorizationURL': 'https://sso.csoc.fpt.net/openid/authorize',
        'tokenURL': 'https://sso.csoc.fpt.net/openid/token',
        'userInfoURL': 'https://sso.csoc.fpt.net/openid/userinfo',
        'issuer': 'https://sso.csoc.fpt.net/openid',
        'scope': 'auth_web openid profile email',
        // 'state': true
    },
    originFrontend: "http://localhost:3000"

};

config.environment = 'development';
const path = __dirname + '/production.txt';
if (fs.existsSync(path)) {
    config.environment = 'production';
}

console.log('ENV - SSB', config.environment, JSON.stringify(config[config.environment]));

module.exports = config;
