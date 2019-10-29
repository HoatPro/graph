const redis = require("redis");
const dbConfig = require('../../../commons/configs/database-config');
const config = dbConfig[dbConfig.environment].redisAuth;

function connector() {
    const client = redis.createClient({
        host: config.host,
        port: config.port,
    });

    client.on('connect', function() {
        console.log('Redis client connected');
    });

    client.on('error', function (err) {
        elk.error({
            function: 'connector',
            controller: 'redis-connector',
            error: {
                ...err
            },
        });
        console.log('Something went wrong ' + err);
    });

    return client;
}

module.exports = connector;