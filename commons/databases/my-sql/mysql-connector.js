const mysql = require("mysql");
require('events').EventEmitter.prototype._maxListeners = 50000;
const elk = require('../elasticsearch/facade/elastic-facade');
const dbConfig = require('../../../commons/configs/database-config');
const config = dbConfig[dbConfig.environment].mysql;


module.exports = function() {

    this.pool = mysql.createPool(config);
    this._query = (query, params, callback) => {
        if (query === undefined || params === undefined || callback === undefined){
            throw 'Not enough parameter query, params, callback (' + query || params || callback + ')';
        }

        this.pool.getConnection((err, connection) => {
            if (err) {
                elk.error({
                    controller: 'mysql-connector',
                    function: 'getConnection',
                    error: err,
                    data: {
                        host: config.host,
                        database: config.database,
                        user: config.user
                    }
                });

                if (connection)
                    connection.release();

                callback(err, null);
                throw err;
            }

            const execute = connection.query(query, params, (err, rows) => {
                connection.release();
                if (!err) {
                    callback(null, rows);
                }
                else {
                    callback(err, null);
                }

            });

            const sql = execute.sql;


            connection.on('error', (err) => {
                connection.release();
                callback(err, null);
                throw err;
            });
        });
    };

    this._transaction = async () => {
        try {
            return await new Promise((resolve, reject) => {
                this.pool.getConnection((err, connection) => {
                    if(err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            });

        } catch (err) {
            elk.error({
                controller: 'mysql-connector',
                function: '_transaction',
                error: err,
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


