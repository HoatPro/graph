'use strict';
const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const jwt = require('jsonwebtoken');
const Base = require('../../../../commons/utils/base');
const base = new Base();
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const bcrypt = require('bcryptjs');

function validate(user, insert) {
    if (user.username && user.username === "") {
        return false;
    }

    if (!base.validUsername(user.username)) {
        return false;
    }

    if (user.fullName && user.fullName === "") {
        return false;
    }

    // if(!base.validUsername(user.fullName)) {
    //     return false;
    // }

    if (user.email && user.email === "") {
        return false;
    }

    if (!base.validEmail(user.email)) {
        return false;
    }

    if (!user.isCompany && insert) {
        if (user.password && user.password === "") {
            return false;
        }

        if (!base.validPassword2(user.password)) {
            return false;
        }
    }
    return true;
}

async function getUsers(req, res) {
    const query = req.query;
    console.log('getUser', query);
    let result = {};
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

                // count rows
                const where = `%${search.str ? search.str : ''}%`;
                let count = await mysql.query_transaction(connection, `select count(*) as count from tbl_Users where userName like ? or fullName like ? or email like ?`, [where, where, where]);
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
                        message: "Get Users successful!"
                    };
                } else {
                    //select user by pagination
                    const from = pagination.currentPage * pagination.sizePage;
                    const query = `select * from tbl_Users where userName like ? or fullName like ? or email like ?
                        order by createdDate desc 
                        limit ?, ?`;
                    const users = await mysql.query_transaction(connection, query, [where, where, where, from, pagination.sizePage]);
                    //select user_group
                    let values = [], columns = [];
                    _.forEach(users, r => {
                        values.push(r.userId);
                        columns.push('userId=?');
                    });
                    let users_groups = [];
                    if (_.size(values) > 0) {
                        const query2 = `select tbl_Groups.groupId, groupName, userId
                            from tbl_Users_Groups
                            join tbl_Groups on tbl_Groups.groupId=tbl_Users_Groups.groupId
                            where ${columns.join(' or ')}`;
                        users_groups = await mysql.query_transaction(connection, query2, values);
                    }
                    result = {
                        status: 200,
                        data: formatData(users, users_groups),
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Users successful!"
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
                controller: 'users-controller',
                function: 'getUsers',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get Users failed"
            };
            res.json(result);
        }
    } catch (error) {
        // console.error('getUsers_users-controller', { error: err, data: {} });
        elk.error({
            controller: 'users-controller',
            function: 'getUsers',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get users failed!"
        };
        res.json(result);
    }
}

async function insertUser(req, res) {
    const body = req.body;
    const _bcrypt = _var.bcrypt;
    const userType = _var.userType;
    let result = {};
    try {
        const valid = validate(body);
        if (!valid) {
            result = {
                status: 500,
                message: "Insert failed!"
            };
            res.json(result);
            return false;
        }
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();

                // insert user
                const createdDate = new Date();
                let password;
                if (!body.isCompany) {
                    password = await bcrypt.hashSync(body.password, _bcrypt.saltRounds);
                }
                const id = body.email;
                const query = `insert into tbl_Users (userId, username, fullName, password, email, description, type, createdDate, status) values ?`;
                const insertUser = await mysql.query_transaction(connection, query, [[[id, body.username, body.fullName, password, body.email, body.description, body.isAdmin ? userType.admin : userType.normal, createdDate, 1]]]);


                // insert user_group
                const values = _.map(body.checked, item => ([id, parseInt(item)]));
                await mysql.query_transaction(connection, 'insert into tbl_Users_Groups (userId, groupId) values ?', [values]);
                result = {
                    status: 200,
                    message: "Insert successful!",
                    data: {
                        userId: id
                    }
                };

                // end transaction
                await connection.commit();
                connection.release();
                res.json(result);
            }
        } catch (error) {
            connection.rollback();
            elk.error({
                controller: 'roles-controller',
                function: 'insertGroup',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: body,
                // user: user
            });
            result = {
                status: 500,
                message: "Insert failed"
            };
            res.json(result);
        }
    } catch (error) {
        // console.error('addUser_users-controller', { error: e, data: body });
        elk.error({
            controller: 'users-controller',
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

async function updateUser(req, res) {
    const body = req.body;
    let result = {};
    try {
        const valid = validate(body, false);
        if (!valid) {
            result = {
                status: 500,
                message: "Update failed!"
            };
            res.json(result);
            return false;
        }
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();

                // update user
                let data = {
                    username: body.username,
                    fullName: body.fullName,
                    email: body.email,
                    description: body.description,
                    status: body.status,
                };
                await mysql.query_transaction(connection, `update tbl_Users set ? where userId=?`, [data, body.userId]);

                // update user_group
                const checked = body.checked;
                const groups = _.map(body.groups, o => o.groupId);
                const diff = _.differenceBy(groups, checked, parseInt); // check delete items
                const _diff = _.differenceBy(checked, groups, parseInt); // check insert items
                let values = [];
                if (_.size(diff) > 0) {
                    values = _.map(diff, d => {
                        return [body.userId, d]
                    });
                    await mysql.query_transaction(connection, `delete from tbl_Users_Groups where (userId, groupId) in (?)`, [values]);
                }
                if (_.size(_diff) > 0) {
                    values = [];
                    values = _.map(_diff, d => {
                        return [body.userId, d]
                    });
                    await mysql.query_transaction(connection, `insert into tbl_Users_Groups (userId, groupId) values ?`, [values]);
                }

                result = {
                    status: 200,
                    message: "Update successful!",
                };

                // end transaction
                await connection.commit();
                connection.release();
                res.json(result);
            }
        } catch (error) {
            connection.rollback();
            elk.error({
                controller: 'users-controller',
                function: 'updateUser',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: body,
                // user: user
            });
            result = {
                status: 500,
                message: "Update failed"
            };
            res.json(result);
        }
    } catch (error) {
        // console.error('updateUser_users-controller', { error: e, data: body });
        elk.error({
            controller: 'users-controller',
            function: 'updateUser',
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

// function deleteUser(req, res) {
//     const query = req.query;
//     let result = {};
//     try {
//         const table = _var.tables.users;
//         console.log(table);
//         const tableName = table.name;
//         const columns = table.columns;
//         const conditions = {
//             table: tableName,
//             where: {
//                 and: [
//                     {column: `${tableName}.${columns.id}`, value: query.userId, compare: '='}
//                 ]
//             }
//         };
//         mysql.delete(conditions, resp => {
//             if (_.isNull(resp.data)) {
//                 result = {
//                     status: 500,
//                     message: resp.message ? resp.message : "Delete User failed!"
//                 };
//             } else {
//                 result = {
//                     status: 200,
//                     message: "Delete User successful!",
//                 };
//             }
//             res.json(result);
//         })
//     } catch (error) {
//         // console.error('deleteUser_users-controller', { error: e, data: query });
//         elk.error({
//             controller: 'users-controller',
//             function: 'deleteUser',
//             error: {
//                 message: error.message,
//                 stack: error.stack
//             },
//             data: query
//         });
//         result = {
//             status: 500,
//             message: "Delete User failed!"
//         };
//         res.json(result);
//     }
// }

async function deleteUser(req, res) {
    const query = req.query;
    let result = {};
    try {
        const connection = await mysql.transaction();
        try {
            if (connection) {
                await connection.beginTransaction();
                const userId = query.id;
                //delete User Group
                const queryStr1 = `delete from tbl_Users_Groups where tbl_Users_Groups.userId=? `;
                const deleteCheck = await mysql.query_transaction(connection, queryStr1, [userId]);
                //delete User
                const queryStr2 = `delete from tbl_Users where tbl_Users.userId=?`;
                const deleteUser = await mysql.query_transaction(connection, queryStr2, [userId]);
                if (!deleteCheck || !deleteUser) {
                    result = {
                        status: 500,
                        message: 'Delete failed!'
                    };
                    connection.rollback();
                    return res.j(result);
                }
                result = {
                    status: 200,
                    message: 'Delete successful'
                };
                //end transaction
                await connection.commit();
                connection.release();
                res.json(result);
            }

        } catch (error) {
            connection.rollback();
            elk.error({
                controller: 'users-controller',
                function: 'deleteUser',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {
                    query: query,
                    user: user
                }
            });
            result = {
                status: 500,
                message: "Delete failed"
            }
            res.json(result);
        }

    } catch (error) {
        // console.error('deleteUser_users-controller', { error: e, data: query });
        elk.error({
            controller: 'users-controller',
            function: 'deleteUser',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Delete User failed!"
        };
        res.json(result);
    }
}

function formatData(users, data) {
    let result = [];
    _.forEach(users, r => {
        let groups = [];
        _.forEach(data, item => {
            if (item.userId === r.userId) groups.push({
                groupId: item.groupId,
                groupName: item.groupName,
            })
        });
        result.push({
            ...r,
            groups: groups
        })
    });

    return result;
}

function getAllStockKipper(req, res) {
    let result = {};
    try {
        const queryStr = `select userId, username, email, fullName from tbl_Users where type = 2 order by fullName`;
        mysql.query(queryStr, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get all StockKipper failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get all StockKipper successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'users-controller',
            function: 'getAllStockKipper',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get all StockKipper failed!"
        };
        res.json(result);
    }
}

async function getUserById(req, res) {
    let result = {};
    const query = req.query;
    try {
        const str = `select tbl_Users.userId, username, fullName, password, email, type, tbl_Users.description, tbl_Users.status,  tbl_Users.createdDate, tbl_Users.updatedDate, groupName, tbl_Groups.groupId 
                        from tbl_Users
                        join tbl_Users_Groups on tbl_Users_Groups.userId=tbl_Users.userId
                        join tbl_Groups on tbl_Users_Groups.groupId=tbl_Groups.groupId
                        where tbl_Users.userId=?`;
        mysql.query(str, [query.userId], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get User failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get User successful!",
                    data: formatData2(resp)
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'users-controller',
            function: 'getUserById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get User failed!",
            data: []
        };
        res.json(result);
    }
}


function formatData2(data) {
    let result = [];
    _.forEach(data, item => {
        const find = _.find(result, {userId: item.userId});
        if (find) {
            find.groups.push({groupId: item.groupId, groupName: item.groupName});
        } else {
            let temp = {};
            _.forEach(['userId', 'username', 'fullName', 'type', 'password', 'email', 'description', 'createdDate', 'updatedDate', 'status'], i => {
                temp[i] = item[i];
            });
            temp['groups'] = [{groupId: item.groupId, groupName: item.groupName}];
            result.push(temp);
        }
    });
    return result;
}

async function resetPassword(req, res) {
    const body = req.body;
    let result = {};
    const _bcrypt = _var.bcrypt;
    try {
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();

                // get user by id
                result = {
                    status: 500,
                    message: "Update failed!"
                };
                let user = await mysql.query_transaction(connection, `select * from tbl_Users where userId=?`, [body.userId]);

                if (user) {
                    user = user[0];
                    const compare = bcrypt.compareSync(body.oldPassword, user.password);
                    if (compare) {
                        const hash = bcrypt.hashSync(body.newPassword, _bcrypt.saltRounds);
                        let update = await mysql.query_transaction(connection, `update tbl_Users set password=? where userId=?`, [hash, body.userId]);
                        if (update.affectedRows === 1) {
                            result = {
                                status: 200,
                                message: "Update successful!"
                            };
                        }
                    }
                }

                // end transaction
                await connection.commit();
                connection.release();
                res.json(result);
            }
        } catch (error) {
            connection.rollback();
            elk.error({
                controller: 'users-controller',
                function: 'resetPassword',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Update failed"
            };
            res.json(result);
        }
    } catch (error) {
        // console.error('updateGroup_groups-controller', { error: e, data: body });
        elk.error({
            controller: 'groups-controller',
            function: 'updateGroup',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update Group failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getUsers,
    getAllStockKipper,
    insertUser,
    updateUser,
    deleteUser,
    getUserById,
    resetPassword
};