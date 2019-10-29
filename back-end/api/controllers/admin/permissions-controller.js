'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const base = require('../../base-controller');

function getAllPermission(req, res) {
    let result = [];
    try {
        mysql.query(`select * from tbl_Groups_Routes_Actions`, null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all group successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllPermissions_roles-controller', { error: err, data: {} });
        elk.error({
            controller: 'roles-controller',
            function: 'getAllPermissions',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        res.json({
            status: 500,
            message: 'Get all group failed',
            data: []
        });
    }
}

async function updatePermission(req, res) {
    const body = req.body;
    let result = {};
    const user = await base.getSession(req);
    try {
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();

                // update permissions
                const groupId = body.groupId;
                const auth = body.auth;
                let failed = false;

                if (groupId) {
                    let permissions = await mysql.query_transaction(connection, `select groupId, routeActionId from tbl_Groups_Routes_Actions where groupId=?`, [body.groupId]);
                    if (!_.isNull(permissions)) {
                        let temp = _.map(auth, item => {
                            return {routeActionId: item.routeActionId, groupId: groupId}
                        });
                        permissions = _.map(permissions, item => {
                            return {routeActionId: item.routeActionId, groupId: item.groupId}
                        });
                        if (_.size(temp) === 0) {
                            const _delete = await mysql.query_transaction(connection, `delete from tbl_Groups_Routes_Actions where groupId=?`, [groupId]);

                            if (!_delete || _delete.affectedRows === 0) {
                                failed = true;
                            }
                        } else {
                            const diff = _.differenceWith(permissions, temp, _.isEqual); // delete row
                            const _diff = _.differenceWith(temp, permissions, _.isEqual); // insert row
                            // let values = [];
                            if (_.size(diff) > 0) {
                              let  values = _.map(diff, d => {
                                    return [groupId, d.routeActionId]
                                });
                                const _delete = await mysql.query_transaction(connection, `delete from tbl_Groups_Routes_Actions where (groupId, routeActionId) in (?)`, [values]);


                                if (!_delete || _delete.affectedRows === 0) {
                                    failed = true;
                                }
                            }
                            if (_.size(_diff) > 0) {
                               let values2 = _.map(_diff, d => {
                                    return [groupId, d.routeActionId]
                                });
                                const insert = await mysql.query_transaction(connection, `insert into tbl_Groups_Routes_Actions (groupId, routeActionId) values ?`, [values2]);

                                if (!insert || insert.affectedRows === 0) {
                                    failed = true;
                                }
                            }
                        }
                    } else {
                        failed = true;
                    }
                } else {
                    failed = true;
                }

                if (failed) {
                    elk.error({
                        controller: 'roles-controller',
                        function: 'updatePermission',
                        error: {
                            message: "Update failed"
                        },
                        data: {
                            body: body,
                            user: user
                        },

                    });
                    result = {
                        status: 500,
                        message: "Update failed"
                    };
                    connection.rollback();
                    return res.json(result);
                } else {
                    result = {
                        status: 200,
                        message: "Update successful"
                    };
                }

                // end transaction
                await connection.commit();
                connection.release();
                res.json(result);
            }
        } catch (error) {
            connection.rollback();
            elk.error({
                controller: 'roles-controller',
                function: 'updatePermission',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {
                    body: body,
                    user: user
                },
            });
            result = {
                status: 500,
                message: "Update failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'roles-controller',
            function: 'updatePermission',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                body: body,
                user: user
            },
        });
        result = {
            status: 500,
            message: "Update failed!"
        };
        res.json(result);
    }
}

function formatData(roles, data) {
    let result = [];
    _.forEach(roles, r => {
        let operations = [];
        _.forEach(data, item => {
            if (item.roleId === r.roleId) operations.push({
                operationId: item.operationId,
                operationName: item.operationName,
                operationKey: item.operationKey,
            })
        });
        result.push({
            ...r,
            operations: operations
        })
    });

    return result;
}

function validate(data) {
    if (!data.roleName) {
        return false;
    }

    return true;
}

function getPermission(req, res) {
    let result = {};
    const query = req.query;
    try {
        const groupId = query.groupId;
        let str = `select * from tbl_Groups_Routes_Actions as gra
                join tbl_Routes_Actions as ra on gra.routeActionId = ra.routeActionId`;
        if (groupId) {
            str += ` where gra.groupId=?`;
        }

        mysql.query(str, [groupId], resp => {
            let data = [];

            if (!_.isNull(resp)) {
                data = resp;
            }
            result = {
                status: 200,
                data: data
            };
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'roles-controller',
            function: 'getPermission',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                query: query
            }
        });
        result = {
            status: 500,
            message: "Get Permissions failed!",
            data: []
        };
        res.json(result);
    }
}

function getMaxActionOfRoute(req, res) {
    let result = [];
    try {
        mysql.query(`select count(actionId) as count from tbl_Routes_Actions
            group by routeId
            order by count desc
            limit 1`, null, resp => {
            let temp = 0;
            if (!_.isNull(resp)) {
                temp = resp[0].count;
            }
            result = {
                status: 200,
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllPermissions_roles-controller', { error: err, data: {} });
        elk.error({
            controller: 'permissions-controller',
            function: 'getMaxActionOfRoute',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        res.json({
            status: 500,
            message: 'Get failed',
            data: 0
        });
    }
}


module.exports = {
    getAllPermission,
    updatePermission,
    getPermission,
    getMaxActionOfRoute,
};