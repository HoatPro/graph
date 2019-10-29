var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('client:server');
var http = require('http');
// var session = require('express-session');
var bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const backend = require('../commons/configs/back-end-config');
const config = backend[backend.environment];
const path = require('path');
var session = require('./configs/sessions/session');
let app = express();

app.use(session);

// app.use(session({
//     secret: '!@#$%^&*()',
//     resave: true,
//     saveUninitialized: true,
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }));
app.use(cors());
app.use(logger('dev'));
// app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(fileUpload({
    limits: {fileSize: 5 * 1024 * 1024}, // bytes
}));
app.use('/raca-api/uploads', express.static(path.join(__dirname, 'storage', 'uploads')));
// const sessionParser = session(config.session);


// app.use(middleware.checkPermissions);

require('./routes/routes')(app);

// app.use(middleware.checkPermissions);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.session.user) {
        res.locals.userId = req.session.user.id;
    }
    next();
});


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(createError(404));
});


// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error pace
    res.status(err.status || 500).json(err);
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(config.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
// var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, '0.0.0.0');
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log(addr);
}

module.exports = app;
