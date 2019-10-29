let prev = 'http://idc-apistag.fpt.net'; //process;
const env = process.env.NODE_ENV;

if(env === 'production') prev = 'http://idc-api.fpt.net';
console.log('-----ENV-----', env);

let api = {
    token: prev + '/api/Token',
    survey: prev + '/api/ISC/Survey',
    deployment: prev + '/api/ISC/Deploy',
};

module.exports = api;