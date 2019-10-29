const elasticsearch = require('elasticsearch');
const dbConfig = require('../../../commons/configs/database-config');
const config = dbConfig[dbConfig.environment].elasticsearch;
function connector() {
    const connect = new elasticsearch.Client({
        host: config.host + ':' + config.port,
        requestTimeout: config.requestTimeout
    });
    return  connect;
}
module.exports = connector;
