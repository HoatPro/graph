const mysql = require("mysql");
require('events').EventEmitter.prototype._maxListeners = 50000;
const elk = require('../elasticsearch/facade/elastic-facade');
const dbConfig = require('../../../commons/configs/database-config');
const config = dbConfig[dbConfig.environment].mysql;
const PoolManager = require('mysql-connection-pool-manager');
const options = {
    idleCheckInterval: 1000,
    maxConnextionTimeout: 30000,
    idlePoolTimeout: 3000,
    errorLimit: 5,
    preInitDelay: 50,
    sessionTimeout: 60000,
    onConnectionAcquire: () => {console.info("Acquire");},
    onConnectionConnect: () => {console.info("Connect");},
    onConnectionEnqueue: () => {console.info("Enqueue");},
    onConnectionRelease: () => {console.info("Release");},
    mySQLSettings: dbConfig[dbConfig.environment].mysql
};

module.exports = function() {
    const mySQL = PoolManager(options);
    // this.pool = mysql.createPool(config);
    this._query = (query, params, callback) => {
        if (query === undefined || params === undefined || callback === undefined){
            throw 'Not enough parameter query, params, callback (' + query || params || callback + ')';
        }

        let sql = mysql.format(query, params);

        mySQL.query(sql, function(res, err) {
            if (!err) {
                callback(null, res);
            }
            else {
                callback(err, null);
            }
        });
    };

    this._transaction = async () => {
        try {
            return await new Promise((resolve, reject) => {
                mySQL.getConnection((err, connection) => {
                    if(err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            });

        } catch (error) {
            elk.error({
                controller: 'mysql-connector',
                function: '_transaction',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {
                    host: config.host,
                    database: config.database,
                    user: config.user
                }
            });
            return null;
        }
    }
};


