'use strict';

const Mysql = require('../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const _var = require('../../../commons/utils/var');
const elk = require('../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllUser(req, res) {
    const body = req.body;
    let result = {};
    let promises = [];
    try {
        const pagination = _.size(body.pagination) > 0 ? body.pagination : _var.pagination;
        const users = _var.tables.users;
        const columns = users.columns;
        const conditions = {
            table: users.name,
            order: {
                column: columns.createdDate,
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
                message: "Get users successful!"
            };
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'admin-controller',
            function: 'getAllUser',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Get users failed!"
        };
        res.json(result);
    }
}

function insertUser(req, res) {
    const body = req.body;
    const password = body.password;
    const _jwt = _var.jwt;
    let result = {};
    try {
        const createdDate = new Date();
        const password_jwt = jwt.sign({password: password}, _jwt.secret, {algorithm: _jwt.algorithms});
        let conditions = {
            table: _var.tables.users.name,
            columns: {
                username: body.username,
                password: password_jwt,
                email: body.email,
                createdDate: createdDate,
                status: (body.status === true) ? 1 : 0,
            }
        };

        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Add Users failed!"
                };
            } else {
                conditions.columns.userId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Add Users successful!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'admin-controller',
            function: 'insertUser',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add User failed!"
        };
        res.json(result);
    }
}

function updateUser(req, res) {
    const body = req.body;
    const _jwt = _var.jwt;
    let result = {};
    try {
        const table = _var.tables.users;
        const tableName = table.name;
        const columns = table.columns;
        const updatedDate = new Date();
        const password = body.password;
        const password_jwt = jwt.sign({password: password}, _jwt.secret, {algorithm: _jwt.algorithms});

        const conditions = {
            table: tableName,
            columns: {
                password: password_jwt,
                email: body.email,
                updatedDate: updatedDate,
                status: (body.status === true) ? 1 : 0
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.userId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Update User failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Update User successful!",
                    data: {
                        ...body,
                        updatedDate: updatedDate
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'admin-controller',
            function: 'updateUser',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update User failed!"
        };
        res.json(result);
    }
}

function deleteUser(req, res) {
    const body = req.body;
    let result = {};
    try {
        const id = body.userId;
        const table = _var.tables.users;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.userId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : `Delete user failed!`
                };
            } else {
                result = {
                    status: 200,
                    message: `Delete user successful!`,
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'admin-controller',
            function: 'deleteUser',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Delete user failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllUser,
    insertUser,
    updateUser,
    deleteUser
};