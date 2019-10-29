'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllIssues(req, res) {
    let result = [];
    try {
        const issues = _var.tables.issues;
        const columns = issues.columns;
        const conditions = {
            table: issues.name,
            order: {
                column: columns.id,
                type: "DESC"
            },
        };

        mysql.search(conditions, (resp) => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all issue successful',
                data: temp
            };
            res.json(result);
        });
    } catch (err) {
        // console.error('getAllIssues_issues-controller', { error: err, data: {} });
        elk.error({
            controller: 'issues-controller',
            function: 'getAllIssues',
            error: err,
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all issue failed',
        };
        res.json(result);
    }
}

function getIssues(req, res) {
    const query = req.query;
    let result = {};
    let promises = [];
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const issues = _var.tables.issues;
        const columns = issues.columns;
        const conditions = {
            table: issues.name,
            order: {
                column: columns.id,
                type: "DESC"
            },
        };
        const promise = new Promise(resolve => {
            mysql.count(conditions, resp => {
                resolve(resp);
            })
        });
        promises.push(promise);
        const promise1 = new Promise(resolve => {
            const temp = {
                ...conditions,
                limit: {
                    from: pagination.currentPage * pagination.sizePage,
                    size: pagination.sizePage
                }
            };
            mysql.search(temp, (resp) => {
                resolve(resp);
            });
        });
        promises.push(promise1);

        Promise.all(promises).then(resp => {
            const count = resp[0];
            const data = resp[1];
            let temp = [];
            if (!_.isNull(data)) {
                temp = data;
            }
            const countPage = ~~((count - 1) / pagination.sizePage) + 1;
            result = {
                status: 200,
                data: temp,
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get issues successful!"
            };
            res.json(result);
        });

    } catch (err) {
        // console.error('getIssues_issues-controller', { error: err, data: {} });
        elk.error({
            controller: 'issues-controller',
            function: 'getIssues',
            error: err,
            data: query
        });
        result = {
            status: 500,
            message: "getIssues failed!"
        };
        res.json(result);
    }
}

function insertIssue(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const table = _var.tables.issues;
        const columns = table.columns;
        let conditions = {
            table: table.name,
            columns: {
                [columns.name]: body.name,
                [columns.desc]: body.desc,
            }
        };

        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Add Issues failed!"
                };
            } else {
                conditions.columns.issueId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Add Issues successful!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (e) {
        // console.error('addIssue_issues-controller', { error: e, data: body });
        elk.error({
            controller: 'issues-controller',
            function: 'insertIssue',
            error: e,
            data: body
        });
        result = {
            status: 500,
            message: "Add Issues failed!"
        };
        res.json(result);
    }
}

function updateIssue(req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.issues;
        const tableName = table.name;
        const columns = table.columns;
        const updatedDate = new Date();

        const conditions = {
            table: tableName,
            columns: {
                [columns.name]: body.name,
                [columns.desc]: body.desc,
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.issueId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Update Issues failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Update Issues successful!",
                    data: {
                        ...body,
                        updatedDate: updatedDate
                    }
                };
            }
            res.json(result);
        });
    } catch (e) {
        // console.error('updateIssue_issues-controller', { error: e, data: body });
        elk.error({
            controller: 'issues-controller',
            function: 'updateIssue',
            error: e,
            data: body
        });
        result = {
            status: 500,
            message: "Update Issues failed!"
        };
        res.json(result);
    }
}

function deleteIssue(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.issues;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.issueId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete Issue failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete Issue successful!",
                };
            }
            res.json(result);
        })
    } catch (e) {
        // console.error('deleteIssue_issues-controller', { error: e, data: query });
        elk.error({
            controller: 'issues-controller',
            function: 'deleteIssue',
            error: e,
            data: query
        });
        result = {
            status: 500,
            message: "Delete Issue failed!"
        };
        res.json(result);
    }
}

function genarateValues(data) {
    const createdDate = new Date();
    let values = data.map(row => {
        let temp = [...row];
        temp.shift();
        return temp;
    });
    values.shift();
    // values.pop();
    return values;
}

async function importIssue(req, res) {
    let result = {};
    try {
        const data = req.body;
        /*
        *  insert multiple rows
        * data: {table: table_name, columns: [column1, columns2], values: [[value1, value2], [value1`, value2`]] }
        * */
        const issues = _var.tables.issues;
        const columns = issues.columns;
        let conditions = {
            table: issues.name,
            columns: [
                columns.name,
                columns.desc,
                // columns.createdDate,
                // columns.updatedDate,
            ],
            values: genarateValues(data)
        };
        let truncate = await truncateTable(conditions);
        if (truncate) {
            mysql.insertMulti(conditions, resp => {
                if (_.isNull(resp.data)) {
                    result = {
                        status: 500,
                        message: resp.message ? resp.message : "Import failed!"
                    };
                } else {
                    result = {
                        status: 200,
                        message: "Import successful!"
                    };
                }
                res.json(result);
            });
        } else {
            result = {
                status: 500,
                message: resp.message ? resp.message : "Import failed!"
            };
            res.json(result);
        }
    } catch (e) {
        console.error('importIssue', {error: e});
        result = {
            status: 500,
            message: "Import failed!"
        };
        res.json(result);
    }
}

function truncateTable(conditions) {
    return new Promise((resolve, reject) => {
        let result = null;
        try {
            mysql.truncateTable(conditions, resp => {
                if (resp) {
                    result = true;
                } else {
                    result = false;
                }
                resolve(result);
            });
        } catch (e) {
            console.error('truncate-issue-error', {error: e});
            result = false;
            resolve(result);

        }
    });

}


module.exports = {
    getAllIssues,
    getIssues,
    insertIssue,
    updateIssue,
    deleteIssue,
    importIssue,
};