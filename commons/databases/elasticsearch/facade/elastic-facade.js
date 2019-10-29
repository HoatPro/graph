const elk = require('../elasticsearch-connector')();
const _var = require('../../../utils/var');
const moment = require('moment');

function bulk(body, callback) {
    elk.bulk({body}, callback);
}

function insert(data, callback) {
    const index = createIndex();
    const config =  _var.logConfig;
    data['createdDate'] = new Date();
    elk.index({
        index: index,
        type: config._type,
        body: data
    }, function (err, resp) {
        if(err) {
            let _err = JSON.stringify(err);
            _err = JSON.parse(_err);
            console.log('error_elastic-facade insert', _err);
            callback(null);
        } else {
            callback(resp);
        }
    });
}

function createIndex() {
    const config = _var.logConfig;
    const date = moment().format(config.formatDate);
    return `${config.prevIndex}-${date}`;
}

/**
 * insert error log
 * params: {
 *     function: function_name,
 *     controller: controller_name,
 *     error: object_error,
 *     data: ...
 * }
 * */
function error(body) {
    const index = createIndex();
    const config =  _var.logConfig;
    const type = config.type.error;
    body['type'] = type;
    body['createdDate'] = new Date();
    elk.index({
        index: index,
        type: config._type,
        body: body
    }, function (error, resp) {
        if(error) {
            console.log('error_elastic-facade', error);
        }
    });
}

async function search(data) {
    const config =  _var.logConfig;
    const {index = `${config.prevIndex}*`, body = {}} = data;

    return await elk.search({
        index: index,
        body: body
    });
}

module.exports = {
    bulk,
    insert,
    error,
    search
};