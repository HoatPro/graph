// const dotenv = require('dotenv');
// dotenv.config();
const node_env = process.env.NODE_ENV;
let config = {};


config.production = {
    originBackend: 'https://raca.ast.fpt.net',
    originFrontend: 'https://raca.ast.fpt.net',
    originRoot: 'https://ast.fpt.net',
    prevOrigin: '/raca-api',
    prevURL: '',
    // originBackend: 'http://172.27.229.69:4000'
};

config.development = {
    // originBackend: `${protocol}//${hostname}:4000`
    originBackend: `http://localhost:3001`,
    originFrontend: 'http://localhost:3000',
    // originRoot: 'https://ast.fpt.net',
    originRoot: 'https://localhost:4000',
    // originRoot: 'https://172.27.137.72:4000',
    // originRoot: 'http://172.27.137.72:4000',
    prevOrigin: '/raca-api',
    prevURL: '',
};

config.environment = 'development';

if (~['production'].indexOf(node_env)) {
    config.environment = 'production';
}
// console.log('ENV: ', config.environment ,config);
module.exports = config;
