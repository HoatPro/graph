'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllState(req, res) {
    let result = {};
    try {
        const queryStr = `select * from tbl_States order by stateName`;
        mysql.query(queryStr, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get all state failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get all state successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'states-controller',
            function: 'getAllState',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get all state failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllState,

};