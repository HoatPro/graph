const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'});

const node_env = process.env.NODE_ENV;

let config = {};

config.production = {
    elasticsearch: {
        url: 'http://localhost:9200',
        host: '172.27.219.41',
        port: '9200',
        requestTimeout: 120000
    },
    mysql: {
        connectionLimit : 500,
        host: "localhost",
        user: "root",
        password: "root",
        database: "raca_new"
    },
    redisApp: {
        host: 'localhost',
        port: '6379',
        ttl: 86400, //expiration in seconds,
        secret: '!@#$%^&*()',
        cookie: {
            httpOnly: true,
            maxAge: 86400000, // 1 day
        },
    },
    redisAuth: {
        host: '172.27.131.236',
        port: '6379',
        ttl: 86400, //expiration in seconds,
        secret: '!@#$%^&*()',
        cookie: {
            httpOnly: true,
            maxAge: 86400000, // 1 day
        },
    },
    // elasticsearch: {
    //     url: 'http://118.68.13.179:9210',
    //     host: '118.68.13.179',
    //     port: '9210',
    //     requestTimeout: 120000
    // },
    // mysql: {
    //     connectionLimit : 500,
    //     host: "118.68.13.179",
    //     user: "ast",
    //     password: "nocast@123",
    //     database: "raca_new"
    // }
};

config.development = {
    elasticsearch: {
        url: 'http://172.27.229.69:9210',
        host: '172.27.229.69',
        port: '9210',
        requestTimeout: 120000
    },
    mysql: {
        connectionLimit : 500,
        host: "172.27.229.69",
        user: "root",
        password: "ftel@123",
        database: "raca_new"
    },
    // mysql: {
    //     connectionLimit : 500,
    //     host: "172.27.131.238",
    //     user: "root",
    //     password: "root",
    //     database: "raca_new"
    // },
    // mysql: {
    //     connectionLimit : 500,
    //     host: "118.68.13.179",
    //     user: "ast",
    //     password: "nocast@123",
    //     database: "raca_new"
    // },
    redisApp: {
        host: 'localhost',
        port: '6379',
        ttl: 86400, //expiration in seconds,
        secret: '!@#$%^&*()',
        cookie: {
            httpOnly: true,
            maxAge: 86400000, // 1 day
        },
    },
    redisAuth: {
        host: '172.27.229.69',
        port: '6379',
        ttl: 86400, //expiration in seconds,
        secret: '!@#$%^&*()',
        cookie: {
            httpOnly: true,
            maxAge: 86400000, // 1 day
        },
    },
    // elasticsearch: {
    //     url: 'http://118.68.13.179:9210',
    //     host: '118.68.13.179',
    //     port: '9210',
    //     requestTimeout: 120000
    // },

};

config.environment = 'development';

if (~['production'].indexOf(node_env)) {
    config.environment = 'production';
}


console.log('ENV - DB', config.environment, JSON.stringify(config[config.environment]));

module.exports = config;
