'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllTypes(req, res) {
    let result = {};
    try {
        const query = `select * from tbl_Types order by typeName`;
        mysql.query(query, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get all types failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get all types successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'types-controller',
            function: 'getAllTypes',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get all types failed!"
        };
        res.json(result);
    }
}

async function getTypes(req, res) {
    const query = req.query;
    let result = {};
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const tables = _var.tables;
        const types = tables.types;
        const typesColumns = types.columns;
        const conditions = {
            table: types.name,
            order: {
                tables: types.name,
                column: typesColumns.id,
                type: "ASC"
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
                data: {
                    data: []
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get Types successful!"
            };
        } else {
            // get Types by pagination
            const respTypes = await new Promise(resolve => {
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
                data: {
                    data: respTypes,
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get Types successful!"
            };
        }
        res.json(result);
    } catch (error) {
        elk.error({
            controller: 'types-controller',
            function: 'getTypes',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Types failed!"
        };
        res.json(result);
    }
}

async function insertType(req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const types = tables.types;
        const typesColumns = types.columns;
        let conditions = {
            table: types.name,
            columns: {
                [typesColumns.code]: body.code,
                [typesColumns.name]: body.name,
            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi thêm Type!"
                };
            } else {
                conditions.columns.typeId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Thêm Type thành công!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'types-controller',
            function: 'insertType',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi thêm Type"
        };
        res.json(result);
    }
}

function updateType(req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.types;
        const tableName = table.name;
        const columns = table.columns;

        let conditions = {
            table: tableName,
            columns: {
                [columns.name]: body.name,
                [columns.code]: body.code,
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.typeId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi sửa Loại Hình!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Sửa Loại Hình thành công!",
                    types: {
                        ...body,
                        updatedDate: updatedDate
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'types-controller',
            function: 'updateType',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi sửa Loại Hình!"
        };
        res.json(result);
    }
}

function deleteType(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.types;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.typeId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi xóa Type!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Xóa Loại Hình thành công!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'types-controller',
            function: 'deleteType',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Lỗi xóa Loại Hình!"
        };
        res.json(result);
    }
}

async function searchTypes(req, res) {
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

        const conditions = `select count(typeId) as count from (
                            SELECT * FROM tbl_Types 
                            WHERE tbl_Types.typeCode LIKE ? AND tbl_Types.typeName LIKE ?
                            GROUP BY tbl_Types.typeId)as t`;
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
                types: {
                    data: [],
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get Types successful!"
            };
        } else {
            const respTypes = await new Promise(resolve => {
                const queryStr = `SELECT * FROM tbl_Types 
                                 WHERE tbl_Types.typeCode LIKE ? AND tbl_Types.typeName LIKE ?
                                 order by typeId LIMIT ?,?`;
                mysql.query(queryStr, [`%${code}%`, `%${name}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
                    resolve(resp);
                });
            });
            if (_.size(respTypes) > 0) {
                result = {
                    status: 200,
                    types: {
                        data: respTypes
                    },
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                    message: "Get Types successful!"
                };
            } else {
                result = {
                    status: 200,
                    types: {
                        data: [],
                    },
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                    message: "Get Types successful!"
                };
            }
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'types-controller',
            function: 'searchTypes',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Tìm kiếm Loại Hình lỗi!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllTypes,
    getTypes,
    insertType,
    updateType,
    deleteType,
    searchTypes,
};