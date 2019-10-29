var session = require('express-session');
var redis = require("redis");
var redisStore = require('connect-redis')(session);
const _config = require('../session-config');
const config = _config[_config.environment];
const redisConfig = config.redis;
var client = redis.createClient({host: redisConfig.host, port: redisConfig.port});

var sessionOptions = {
    saveUninitialized: true, // saved new sessions
    resave: false, // do not automatically write to the session store
    store: new redisStore({host: redisConfig.host, port: redisConfig.port, client: client, ttl: redisConfig.ttl}),
    secret: redisConfig.secret,
    cookie: redisConfig.cookie,
};

module.exports = session(sessionOptions);
