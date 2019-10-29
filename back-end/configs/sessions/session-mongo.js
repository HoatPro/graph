var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const _config = require('../config');
const config = _config[_config.environment];
//setup mongo connection values
var user = 'mongo';
var password = 'mongo';
var host = '127.0.0.1';
var port = 27017;
var database = 'admin';

var connectionstring = user + ":" + password + "@" + host + ":" + port + "/" + database;

var sessionOptions = {
    saveUninitialized: true, // saved new sessions
    resave: false, // do not automatically write to the session store
    store: new MongoDBStore(
        {
            uri: 'mongodb://' + connectionstring,
            collection: 'sessions'
        },
        function (e) {
            console.error(e);
        }
    ),
    secret: '!@#$%^&*()',
    cookie: {
        httpOnly: true,
        maxAge: 1800000,
    },
};

module.exports = session(sessionOptions);
