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
        connectionLimit : 500,
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

config.environment = 'development';

if (fs.existsSync(__dirname + '../production.txt')){
    config.environment = 'production';
}

console.log('ENV - SS', config.environment, JSON.stringify(config[config.environment]));

module.exports = config;
