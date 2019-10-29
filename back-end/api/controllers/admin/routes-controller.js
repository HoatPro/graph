'use strict';
const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const base = require('../../base-controller');

function getAllRoute(req, res) {
    let result = [];
    try {
        mysql.query('select * from tbl_Routes order by code', null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all route successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllRoutes_routes-controller', { error: err, data: {} });
        elk.error({
            controller: 'routes-controller',
            function: 'getAllRoutes',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all route failed',
            data: []
        };
        res.json(result);
    }
}

async function getRoutes(req, res) {
    const query = req.query;
    let result = {};
    // const user = middleware.getUser(req);
    try {
        const connection = await mysql.transaction();
        const _pagination = query.pagination ? JSON.parse(query.pagination) : {};
        const search = query.search ? JSON.parse(query.search) : {};
        const pagination = {
            currentPage: _pagination.currentPage ? parseInt(_pagination.currentPage) : _var.pagination.currentPage,
            sizePage: _pagination.sizePage ? parseInt(_pagination.sizePage) : _var.pagination.sizePage,
        };
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();
                // const test = await mysql.query_transaction(connection, 'SELECT * FROM `tbl_Routes` where routeId=109', null);
                // count rows
                const where = `%${search.str ? search.str : ''}%`;
                let count = await mysql.query_transaction(connection, `select count(*) as count from tbl_Routes where routeName like ? or routeKey like ?`, [where, where]);
                count = count[0].count;
                const countPage = ~~((count - 1) / pagination.sizePage) + 1;
                if (count === 0) {
                    result = {
                        status: 200,
                        data: [],
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get routes successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;

                    // routes
                    let routes = await mysql.query_transaction(connection, `select * from tbl_Routes where routeName like ? or routeKey like ? order by createdDate desc limit ?, ?`, [where, where, from, pagination.sizePage]);

                    // roles
                    if (_.size(routes) > 0) {
                        const ids = _.map(routes, r => r.routeId);
                        const roles = await mysql.query_transaction(connection,
                                `select * from tbl_Routes_Actions
                                              join tbl_Actions on tbl_Routes_Actions.actionId=tbl_Actions.actionId
                                              where tbl_Routes_Actions.routeId in ?`, [[ids]]);
                        _.forEach(routes, r => {
                            const values = _.values(_.pickBy(roles, {routeId: r.routeId}));
                            r.actions = values || [];
                        })

                    }
                    result = {
                        status: 200,
                        data: routes,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Routes successful!"
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
                controller: 'routes-controller',
                function: 'getRoutes',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get Routes failed!"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'routes-controller',
            function: 'getRoutes',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "get Routes failed!",
            data: [],
        };
        res.json(result);
    }
}

function getRouteById(req, res) {
    let result = {};
    const query = req.query;
    try {
        const str = `select r.routeId, r.routeName, r.routeKey, r.createdDate, r.updatedDate, r.code, r.description, r.status, ra.actionId, a.actionKey from tbl_Routes as r
        left join tbl_Routes_Actions as ra on ra.routeId=r.routeId
        left join tbl_Actions as a on ra.actionId=a.actionId
        where r.routeId=?`;
        mysql.query(str, [query.routeId], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Routes failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Routes successful!",
                    data: formatData(resp)
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'routes-controller',
            function: 'getRouteById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get Routes failed!",
            data: []
        };
        res.json(result);
    }
}

function getParents(req, res) {
    let result = {};
    try {
        mysql.query(`select * from tbl_Routes where char_length(code) = 3 order by createdDate desc`, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Routes failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Routes successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'routes-controller',
            function: 'getParents',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get Routes failed!",
            data: []
        };
        res.json(result);
    }
}

async function insertRoute(req, res) {
    const body = req.body;
    const query = req.query;
    let result = {};
    try {
        const createdDate = new Date();
        if (!validate(body)) {
            res.json(result = {
                status: 500,
                message: "Insert failed!"
            });
            return false;
        }
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();
                // get parent
                const parentId = body.parentId || null;
                let code = '';
                if (!_.isNull(parentId)) {
                    let last = await mysql.query_transaction(connection, `select * from tbl_Routes where code like ? order by code desc limit 1`, [`${body.parentCode}%`]);
                    if (_.isNull(last)) {
                        result = {
                            status: 500,
                            message: "Insert failed!"
                        };
                        return res.json(result);
                    }
                    last = _.isArray(last) ? last[0] : last;
                    code = await genCode(false, last.code);
                } else {
                    code = await genCode(true);
                }
                const query = `insert into tbl_Routes (routeName, routeKey, description, createdDate, status, code) values ?`;
                const insert = await mysql.query_transaction(connection, query, [[[body.routeName, body.routeKey, body.description, createdDate, 1, code]]]);
                if (_.isNull(insert)) {
                    result = {
                        status: 500,
                        message: "Insert failed!"
                    };
                } else {
                    const id = insert.insertId;
                    result = {
                        status: 200,
                        message: "Insert successful!",
                        data: {
                            routeId: id
                        }
                    };
                    if (!_.isNull(parentId)) {
                        const _query = `insert into tbl_Routes_Actions (actionId, routeId) values ?`;
                        const actions = body.actions || [];
                        const data = _.map(actions, a => {
                            return [a.actionId, id]
                        });
                        const _insert = await mysql.query_transaction(connection, _query, [data]);
                        if (_.isNull(_insert)) {
                            result = {
                                status: 500,
                                message: "Insert failed!"
                            };
                            connection.rollback();
                            res.json(result);
                            return false;
                        }
                    }

                }
                //update to Group_Route_Action

                // end transaction
                await connection.commit();
                connection.release();
                res.json(result);
            }
        } catch (error) {
            connection.rollback();
            elk.error({
                controller: 'roles-controller',
                function: 'insertRoute',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: body,
                // user: user
            });
            result = {
                status: 500,
                message: error.sqlMessage
            };
            res.json(result);
        }
    } catch (error) {
        // console.error('addRoute_routes-controller', { error: e, data: body });
        elk.error({
            controller: 'routes-controller',
            function: 'insertRoute',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Insert Routes failed!"
        };
        res.json(result);
    }
}

async function updateRoute(req, res) {
    const body = req.body;
    let result = {};
    try {
        let data = {
            routeName: body.routeName,
            routeKey: body.routeKey,
            description: body.description,
            updatedDate: new Date(),
            // parentId: body.parentId
        };
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();
                const routeId = body.routeId;

                // get route
                const parentId = body.parentId || null;
                let code = '';

                // case 1: wasParent => child
                if ((body.code.length === 3 && parentId) || (body.code.length > 3 && parentId)) {
                    let last = await mysql.query_transaction(connection, ` select * from tbl_Routes where code like ? order by code desc limit 1`, [`${body.code.slice(0, 3)}%`]);
                    console.log(last);
                    if (_.isNull(last)) last = 0;
                    last = last[0];
                    code = await genCode(false, last.code);

                } else if (body.code.length > 3 && body.isParent) { //case 2: no change
                    code = await genCode(true);
                } else {  // case 3: wasChild => change parent
                    code = body.code;
                }
                data.code = code;
                const query = `update tbl_Routes set ? where routeId=?`;
                const update = await mysql.query_transaction(connection, query, [data, body.routeId]);
                if (_.isNull(update)) {
                    result = {
                        status: 500,
                        message: "Update failed!"
                    };
                } else {
                    // update routes_actions
                    const _actions = body._actions;
                    const actions = body.actions;
                    const diff = _.differenceWith(_actions, actions, _.isEqual); // check delete items
                    const _diff = _.differenceWith(actions, _actions, _.isEqual); // check insert items
                    let values = [];
                    if (_.size(diff) > 0) {
                        values = _.map(diff, d => {
                            return [d.actionId, d.routeId]
                        });
                        const queryStr1 = `delete gra
                                           from tbl_Groups_Routes_Actions as gra
                                           join tbl_Routes_Actions  as ra on gra.routeActionId = ra.routeActionId 
                                           where ra.routeId=?`;
                        await mysql.query_transaction(connection, queryStr1, [routeId]);
                        const queryStr2 = `delete ra
                                           from tbl_Routes_Actions as ra
                                           join tbl_Routes  as r on ra.routeId = r.routeId 
                                           where  ra.routeId=?`;
                        await mysql.query_transaction(connection, queryStr2, [routeId]);
                    }
                    if (_.size(_diff) > 0) {
                        values = _.map(_diff, d => {
                            return [d.actionId, body.routeId]
                        });
                        await mysql.query_transaction(connection, `insert into tbl_Routes_Actions (actionId, routeId) values ?`, [values]);
                    }
                    result = {
                        status: 200,
                        message: "Update successful!",
                        data: {
                            ...data,
                            routeId: body.routeId
                        }
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
                function: 'updateRoute',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: body,
                // user: user
            });
            result = {
                status: 500,
                check: "check2",
                message: error.sqlMessage
            };
            res.json(result);
        }

    } catch (error) {
        elk.error({
            controller: 'routes-controller',
            function: 'updateRoute',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update failed!"
        };
        res.json(result);
    }
}

async function deleteRoute(req, res) {
    const query = req.query;
    let result = {};
    const user = await base.getSession(req);
    try {
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();
                const routeId = query.id;
                // delete group-route-action
                const queryStr1 = `delete gra
                                        from tbl_Groups_Routes_Actions as gra
                                        join tbl_Routes_Actions  as ra on gra.routeActionId = ra.routeActionId
                                        where  ra.routeId=?`;
                const deleteCheck = await mysql.query_transaction(connection, queryStr1, [routeId]);

                // delete route-action
                const queryStr2 = `delete ra
                                        from tbl_Routes_Actions as ra
                                        join tbl_Routes  as r on ra.routeId = r.routeId
                                        where  ra.routeId=?`;
                const _delete = await mysql.query_transaction(connection, queryStr2, [routeId]);

                // delete route
                const queryStr3 = `delete from tbl_Routes where routeId=?`;
                const deleteF = await mysql.query_transaction(connection, queryStr3, [routeId]);
                console.log(deleteF);
                if (!deleteF || !_delete || !deleteCheck) {
                    result = {
                        status: 500,
                        message: "Delete failed"
                    };
                    connection.rollback();
                    return res.json(result);
                }
                result = {
                    status: 200,
                    message: "Delete successful"
                };
                // end transaction
                await connection.commit();
                connection.release();
                res.json(result);
            }
        } catch (error) {
            connection.rollback();
            elk.error({
                controller: 'routes-controller',
                function: 'deleteRoute',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {
                    query: query,
                    user: user
                },
            });
            result = {
                status: 500,
                message: "Delete failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'routes-controller',
            function: 'deleteRoute',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                query,
                user
            }
        });
        result = {
            status: 500,
            message: "Delete failed"
        };
        res.json(result);
    }
}

function validate(data) {
    if (!data.routeName) {
        return false;
    }
    if (!data.routeKey) {
        return false;
    }
    if (data.parentId && _.size(data.actions) === 0) {
        return false;
    }
    return true;
}

function genCode(parent = false, _code) {
    let result = '';
    if (_code && !parent) {
        const current = _code.slice(3, _code.length);
        result = _code.slice(0, 3) + (current.length === 0 ? '001' : getNextIndex(current));
        return result;
    }
    return new Promise(resolve => {
        mysql.query('select code from tbl_Routes order by code desc limit ?', 1, resp => {
            if (_.isNull(resp)) {
                resolve(false);
            } else {
                let result = '';
                if (_.size(resp) === 0) {
                    result = '001';
                } else {
                    const lastCode = resp[0].code;
                    if (parent) {
                        const current = lastCode.slice(0, 3);
                        result = getNextIndex(current);
                    } else {
                        const current = lastCode.slice(3, lastCode.length);
                        result = lastCode.slice(0, 3) + (current.length === 0 ? '001' : getNextIndex(current));
                    }
                }
                resolve(result);
            }
        });
    });
}

function getNextIndex(prev) {
    const index = parseInt(prev) + 1;
    const size = index.toString().length;
    let next = '';
    if (size === 1) next = '00' + index;
    else if (size === 2) next = '0' + index;
    else next = index.toString();

    return next;
}

function formatData(data) {
    let result = [];
    _.forEach(data, item => {
        const find = _.find(result, {routeId: item.routeId});
        if (!find) {
            let temp = {};
            temp = item;
            temp._actions = [];
            if (!_.isNull(item.actionKey)) temp._actions = [{
                routeActionId: item.routeActionId,
                actionKey: item.actionKey,
                actionName: item.actionName,
                actionId: item.actionId,
                icon: item.icon
            }];
            delete temp.actionKey;
            delete temp.actionName;
            delete temp.actionId;
            delete temp.icon;
            delete temp.routeActionId;
            result.push(temp);
        } else {
            find._actions.push({
                routeActionId: item.routeActionId,
                actionKey: item.actionKey,
                actionName: item.actionName,
                actionId: item.actionId,
                icon: item.icon
            });
        }
    });
    return result;
}

function getAllRouteAction(req, res) {
    let result = {};
    try {
        const str = `select r.routeId, ra.routeActionId, r.routeName, r.routeKey, r.createdDate, r.updatedDate, r.code, r.description, r.status, 
        ra.actionId, a.actionKey, a.actionName, a.icon from tbl_Routes as r
        left join tbl_Routes_Actions as ra on ra.routeId=r.routeId
        left join tbl_Actions as a on ra.actionId=a.actionId
        order by r.routeName`;
        mysql.query(str, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get successful!",
                    data: formatData(resp)
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'routes-controller',
            function: 'getAllRouteAction',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get failed!",
            data: []
        };
        res.json(result);
    }
}

module.exports = {
    getAllRoute,
    getRoutes,
    getParents,
    insertRoute,
    updateRoute,
    deleteRoute,
    getRouteById,
    getAllRouteAction
};