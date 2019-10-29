const conn = require('../redis-connector');
const _ = require('lodash');
const elk = require('../../elasticsearch/facade/elastic-facade');
const client = new conn();

function get(keys) {
    return new Promise(resolve => {
        let result = null;
        try {
            client.get(keys, function (error, resp) {
                if(error) {
                    elk.error({
                        controller: 'redis-facade',
                        function: 'get',
                        error: error,
                        data: {
                            keys: keys
                        }
                    });
                } else {
                    result = resp;
                }
                resolve(resp);
            })
        } catch (error) {
            elk.error({
                controller: 'redis-facade',
                function: 'get',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {
                    keys: keys
                }
            });
            resolve(null);
        }
    });
}

function set(name, value) {
    return new Promise(resolve => {
        let result = null;
        try {
            client.set(name, value, function (error, resp) {
                if(error) {
                    elk.error({
                        controller: 'redis-facade',
                        function: 'set',
                        error: error,
                        data: {
                            name: name,
                            value: value
                        }
                    });
                } else {
                    result = resp;
                }
                resolve(resp);
            })
        } catch (error) {
            elk.error({
                controller: 'redis-facade',
                function: 'set',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {
                    name: name,
                    value: value
                }
            });
            resolve(null);
        }
    });
}

module.exports = {
    get,
    set,
};