const Connect = require('../mysql-connector');
const _ = require('lodash');
const elk = require('../../elasticsearch/facade/elastic-facade');

module.exports = function () {

    this.db = new Connect();

    /*------------- Default -----------------*/

    this.query = (query, values, callback) => {
        this.db._query(query, values, (err, resp)=> {
            let result = null;

            if(err) {
                elk.error({
                    controller: 'mysql/backend',
                    function: 'query',
                    error: err,
                    data: {
                        query,
                        values
                    }
                });
            } else {
                result = resp;
            }
            callback(result);
        })
    };

	this.transaction = async () => {
        return await this.db._transaction();
    };

    this.query_transaction = (connection, query, params) => {
        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, rows) => {
                if(err) {
                    connection.rollback();
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    };

    /*-------------End Default -----------------*/

};
