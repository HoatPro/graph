var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var debug = require('debug')('hsg:server');
var bodyParser = require('body-parser');
const flash = require('connect-flash');
var handlebars  = require('express-handlebars'), hbs;
const _ = require('lodash');
const https = require('https');
const http = require('http');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const _config = require('./configs/session-config');
const config = _config[_config.environment];

var app = express();

var session = require('./configs/sessions/session');

app.use(session);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileUpload({
	limits: { fileSize: 5 * 1024 * 1024 }, // bytes
}));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.use('/openid/src', express.static(path.join(__dirname, 'src')));


hbs = handlebars.create({
	defaultLayout: __dirname + '/views/layouts/layout',
	partialsDir: __dirname + '/views/partials',
	layoutsDir: __dirname + '/views/layouts',
	helpers: {
		paginate: require('handlebars-paginate'),

		append: function(name, options) {
			if(!this._sections) {
				this._sections = {};
			}
			if (!this._sections[name]) {
				this._sections[name] = '';
			}

			this._sections[name] += options.fn(this);
			return null;
		},

		prepend: function(name, options) {
			if(!this._sections) {
				this._sections = {};
			}
			if (!this._sections[name]) {
				this._sections[name] = '';
			}

			this._sections[name] = options.fn(this) + this._sections[name];
			return null;
		},

		section: function(name, options){
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		},
		xif: function (a, operator, b, opts) {
			let bool = false;
			switch(operator) {
				case '===':
					bool = a === b;
					break;
				case '==':
					bool = a == b;
					break;
				case '!=':
					bool = a != b;
					break;
				case '>':
					bool = a > b;
					break;
				case '>=':
					bool = a >= b;
					break;
				case '<':
					bool = a < b;
					break;
				case '<=':
					bool = a <= b;
					break;
				case '||':
					bool = a || b;
					break;
				case '&&':
					bool = a && b;
					break;
				case 'isUndefined':
					bool = _.isUndefined(a);
					break;
				default:
					throw "Unknown operator " + operator;
			}

			if (bool) {
				return opts.fn(this);
			} else {
				return opts.inverse(this);
			}
		},
		var: function () {
			let args = [],
				options = arguments[arguments.length - 1];
			for (let i = 0; i < arguments.length - 1; i++) {
				args.push(arguments[i]);
			}

			return options.fn(this, {data: options.data, blockParams: args});
		},

	}
});
// view engine setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

require('./api/middlewares/authentication.js')(app);

require('./routes/routes')(app);
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if (req.session.user) {
		res.locals.userId = req.session.user.id;
	}
	next();
});

app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error pace
	res.status(err.status || 500);
	res.render('pages/error');
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(config.app.port);
app.set('port', port);

/**
 * Create HTTP server.
 */
let server;
if(_config.environment === 'development') {
	const ssl_options = {
		key: fs.readFileSync(__dirname + '/../commons/ssl/server.key'),
		cert: fs.readFileSync(__dirname + '/../commons/ssl/server.crt')
	};

	server = https.createServer(ssl_options, app);

} else {
	server = http.createServer(app);
}
// var server = https.createServer(ssl_options, app);
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

	var bind = typeof port === 'string'
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
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
	console.log(config.app.host + ':' + port);
}

module.exports = app;
