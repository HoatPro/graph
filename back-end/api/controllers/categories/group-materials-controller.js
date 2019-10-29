'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllGroupMaterials(req, res) {
    let result = {};
    try {
        const query = `select * from tbl_GroupMaterials order by groupMaterialName`;
        mysql.query(query, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get all group materials failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get all group materials successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'group-materials-controller',
            function: 'getAllGroupMaterials',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get all group materials failed!"
        };
        res.json(result);
    }
}

async function getGroupMaterials(req, res) {
    const query = req.query;
    let result = {};
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const tables = _var.tables;
        const groupMaterials = tables.groupMaterials;
        const groupMaterialsColumns = groupMaterials.columns;
        const conditions = {
            table: groupMaterials.name,
            order: {
                tables: groupMaterials.name,
                column: groupMaterialsColumns.code,
                type: "DESC"
            },
        };

        // count all records of users
        const count = await new Promise(resolve => {
            mysql.count(conditions, resp => {
                resolve(resp);
            })
        });

        const countPage = ~~((count - 1) / pagination.sizePage) + 1;
        if (count === 0) {
            result = {
                status: 200,
                groupMaterials: {
                    data: []
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get group Materials successful!"
            };
        } else {
            // get groups by pagination
            const getGroupMaterials = await new Promise(resolve => {
                const temp = {
                    ...conditions,
                    limit: {
                        from: pagination.currentPage * pagination.sizePage,
                        size: pagination.sizePage
                    },
                };
                mysql.search(temp, resp => {
                    resolve(resp);
                });
            });
            result = {
                status: 200,
                groupMaterials: {
                    data: getGroupMaterials
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get Group Materials successful!"
            };
        }
        res.json(result);
    } catch (error) {
        elk.error({
            controller: 'group-materials-controller',
            function: 'getGroupMaterials',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Group Materials failed!"
        };
        res.json(result);
    }
}

async function insertGroupMaterial(req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const groupMaterials = tables.groupMaterials;
        const groupMaterialsColumns = groupMaterials.columns;
        let conditions = {
            table: groupMaterials.name,
            columns: {
                [groupMaterialsColumns.code]: body.code,
                [groupMaterialsColumns.name]: body.name,
            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi thêm Nhóm Vật Tư!"
                };
            } else {
                conditions.columns.groupMaterialId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Thêm Nhóm Vật Tư thành công!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'group-materials-controller',
            function: 'insertGroupMaterial',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi thêm Nhóm Vật Tư"
        };
        res.json(result);
    }
}


function updateGroupMaterial(req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.groupMaterials;
        const tableName = table.name;
        const columns = table.columns;
        const updatedDate = new Date();

        let conditions = {
            table: tableName,
            columns: {
                [columns.name]: body.name,
                [columns.code]: body.code,
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.groupMaterialId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi sửa Nhóm Vật Tư!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Sửa Nhóm Vật Tư thành công!",
                    groupMaterials: {
                        ...body,
                        updatedDate: updatedDate
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'group-materials-controller',
            function: 'updateGroupMaterial',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi sửa Nhóm Vật Tư!"
        };
        res.json(result);
    }
}

function deleteGroupMaterial(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.groupMaterials;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.groupMaterialId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi xóa Nhóm Vật Tư!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Xóa Nhóm Vật Tư thành công!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'group-materials-controller',
            function: 'deleteGroupMaterial',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Lỗi xóa Nhóm Vật Tư!"
        };
        res.json(result);
    }
}

async function searchGroupMaterials(req, res) {
    const query = req.query;
    let result = {};
    try {
        const _pagination = JSON.parse(query.pagination);
        const search = JSON.parse(query.search);
        const pagination = {
            currentPage: _pagination.currentPage ? parseInt(_pagination.currentPage) : _var.pagination.currentPage,
            sizePage: _pagination.sizePage ? parseInt(_pagination.sizePage) : _var.pagination.sizePage,
        };
        const name = search.name;
        const code = search.code;

        const conditions = `select count(groupMaterialId) as count from (
                            SELECT * FROM tbl_GroupMaterials 
                            WHERE tbl_GroupMaterials.groupMaterialCode LIKE ? AND tbl_GroupMaterials.groupMaterialName LIKE ?
                            GROUP BY tbl_GroupMaterials.groupMaterialId)as t`;
        const count = await new Promise(resolve => {
            mysql.query(conditions, [`%${code}%`, `%${name}%`], resp => {
                let result = 0;
                if (resp) {
                    result = resp[0].count;
                }
                resolve(result);
            })
        });

        const countPage = ~~((count - 1) / pagination.sizePage) + 1;
        if (count === 0) {
            result = {
                status: 200,
                groupMaterials: {
                    data: [],
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get Group Materials successful!"
            };
        } else {
            const respGroupMaterials = await new Promise(resolve => {
                const queryStr = `SELECT * FROM tbl_GroupMaterials 
                                 WHERE tbl_GroupMaterials.groupMaterialCode LIKE ? AND tbl_GroupMaterials.groupMaterialName LIKE ?
                                 order by groupMaterialId LIMIT ?,?`;
                mysql.query(queryStr, [`%${code}%`, `%${name}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
                    resolve(resp);
                });
            });
            if (_.size(respGroupMaterials) > 0) {
                result = {
                    status: 200,
                    groupMaterials: {
                        data: respGroupMaterials
                    },
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                    message: "Get groupMaterials successful!"
                };
            } else {
                result = {
                    status: 200,
                    groupMaterials: {
                        data: [],
                    },
                    pagination: {
                        currentPage: pagination.currentPage, countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                    message: "Get groupMaterials successful!"
                };
            }
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'group-materials-controller',
            function: 'searchGroupMaterials',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Search GroupMaterials failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllGroupMaterials,
    getGroupMaterials,
    insertGroupMaterial,
    updateGroupMaterial,
    deleteGroupMaterial,
    searchGroupMaterials,
};