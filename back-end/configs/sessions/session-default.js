var session = require('express-session');
const _config = require('../config');
const config = _config[_config.environment];
var sessionParser = session(config.application.session);
module.exports = sessionParser;
