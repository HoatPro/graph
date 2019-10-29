'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllGroup(req, res) {
    let result = [];
    try {
        mysql.query(`select * from tbl_Groups order by groupName`, null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get Groups successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllGroups_groups-controller', { error: err, data: {} });
        elk.error({
            type: 'error',
            controller: 'groups-controller',
            function: 'getAllGroups',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get failed',
            data: []
        };
        res.json(result);
    }
}

async function getGroups(req, res) {
    const query = req.query;
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
                let count = await mysql.query_transaction(connection, `select count(*) as count from tbl_Groups where groupName like ?`, [where]);
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
                        message: "Get Groups successful!"
                    };
                } else {
                    //select groups by pagination
                    const from = pagination.currentPage * pagination.sizePage;
                    const query = `select * from tbl_Groups where groupName like ?
                        order by tbl_Groups.createdDate desc 
                        limit ?, ?`;
                    const groups = await mysql.query_transaction(connection, query, [where, from, pagination.sizePage]);
                    //select role_group

                    if (_.isNull(groups)) {
                        result = {
                            status: 500,
                            data: [],
                            pagination: {
                                currentPage: pagination.currentPage,
                                countPage: countPage,
                                sizePage: pagination.sizePage
                            },
                            message: "Get failed!"
                        };
                    } else {
                        result = {
                            status: 200,
                            data: groups,
                            pagination: {
                                currentPage: pagination.currentPage,
                                countPage: countPage,
                                sizePage: pagination.sizePage
                            },
                            message: "Get Groups successful!"
                        };
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
                controller: 'roles-controller',
                function: 'getGroups',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get failed"
            };
            res.json(result);
        }
    } catch (error) {
        // console.error('getGroups_groups-controller', { error: err, data: {} });
        elk.error({
            controller: 'groups-controller',
            function: 'getGroups',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get groups failed!"
        };
        res.json(result);
    }
}

function insertGroup(req, res) {
    const body = req.body;
    let result = {};
    try {
        // insert group
        const createdDate = new Date();
        if (!validate(body)) {
            res.json(result = {
                status: 500,
                message: "Insert failed!"
            });
            // connection.release();
            return false;
        }
        const query = `insert into tbl_Groups (groupName, description, createdDate, status) values ?`;
        mysql.query(query, [[[body.groupName, body.description, createdDate, 1]]], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Insert failed!",
                    data: {}
                }
            } else {
                const id = resp.insertId;
                result = {
                    status: 200,
                    message: "Insert successful!",
                    data: {
                        groupId: id
                    }
                }
            }
            res.json(result);
        });
    } catch (error) {
        // console.error('addGroup_groups-controller', { error: e, data: body });
        elk.error({
            controller: 'groups-controller',
            function: 'insertGroup',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Insert failed!"
        };
        res.json(result);
    }
}

function updateGroup(req, res) {
    const body = req.body;
    let result = {};
    try {
        let data = {
            groupName: body.groupName,
            description: body.description,
            updatedDate: new Date(),
        };
        if (!validate(data)) {
            res.json(result = {
                status: 500,
                message: "Update failed!"
            });
            return false;
        }
        const query = `update tbl_Groups set ? where groupId=?`;
        mysql.query(query, [data, body.groupId], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Update failed!",
                }
            } else {
                result = {
                    status: 200,
                    message: "Update successful!",
                }
            }
            res.json(result);
        });
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
            message: "Update failed!"
        };
        res.json(result);
    }
}

async function deleteGroup(req, res) {
    const body = req.query;
    let result = {};
    try {

        const queryStr1 = ` delete gra
                                from tbl_Groups_Routes_Actions as gra
                                join tbl_Groups as g on gra.groupId=g.groupId
                                where gra.groupId=?`;
        mysql.query(queryStr1, [body.id], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Delete failed!",
                }
            } else {
                mysql.query(`delete from tbl_Users_Groups where groupid=? `, [body.id], resp => {
                    if (_.isNull(resp)) {
                        result = {
                            status: 500,
                            message: 'Delete failed!'
                        }
                    } else {
                        mysql.query(`delete from tbl_Groups where groupId=?`, [body.id], resp => {
                            if (_.isNull(resp)) {
                                result = {
                                    status: 500,
                                    message: "Delete failed!",
                                }
                            } else {
                                result = {
                                    status: 200,
                                    message: "Delete successful!",
                                }
                            }
                            res.json(result);
                        })
                    }
                })

            }
        });
    } catch (error) {
        // console.error('deleteGroup_groups-controller', { error: e, data: query });
        elk.error({
            controller: 'groups-controller',
            function: 'deleteGroup',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Delete failed!"
        };
        res.json(result);
    }
}

function validate(data) {
    if (!data.groupName) {
        return false;
    }
    return true;
}

async function getGroupById(req, res) {
    let result = {};
    const query = req.query;
    try {
        const str = `select * from tbl_Groups where tbl_Groups.groupId=?`;
        mysql.query(str, [query.groupId], resp => {
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
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'groups-controller',
            function: 'getGroupById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
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
    getAllGroup,
    getGroups,
    insertGroup,
    updateGroup,
    deleteGroup,
    getGroupById,
};