const dotenv = require('dotenv');
dotenv.config({
	path: '/.env'
});
const node_env = nconf.get('NODE_ENV');
const api_key = nconf.get('API_KEY');

let config = {};

config.api_key = api_key;

config.production = {
	originBackend: 'http://localhost:3001',
	prevURL: '/raca',
};

config.development = {
	originBackend: 'http://localhost:3001',
	prevURL: ''
};

config.environment = 'development';

if (~['development'].indexOf(node_env)) {
	config.environment = 'development';
}
if (~['production'].indexOf(node_env)) {
	config.environment = 'production';
}

module.exports = config;
