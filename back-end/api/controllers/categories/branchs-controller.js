'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

async function getBranchs(req, res) {
    const query = req.query;
    let result = {};
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const tables = _var.tables;
        const branchs = tables.branchs;
        const branchsColumns = branchs.columns;
        const conditions = {
            table: branchs.name,
            order: {
                tables: branchs.name,
                column: branchsColumns.createdDate,
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
                data: {
                    data: []
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get branchs successful!"
            };
        } else {
            // get groups by pagination
            const getBranchs = await new Promise(resolve => {
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
                    data: getBranchs
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get Branchs successful!"
            };
        }
        res.json(result);
    } catch (error) {
        elk.error({
            controller: 'branchs-controller',
            function: 'getBranchs',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Branchs failed!"
        };
        res.json(result);
    }
}

async function insertBranch(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const tables = _var.tables;
        const branchs = tables.branchs;
        const branchsColumns = branchs.columns;
        let conditions = {
            table: branchs.name,
            columns: {
                [branchsColumns.code]: body.code,
                [branchsColumns.name]: body.name,
                [branchsColumns.status]: body.status ? 1 : 0,
                [branchsColumns.createdDate]: createdDate,
            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi thêm Chi Nhánh!"
                };
            } else {
                conditions.columns.branchId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Thêm Chi Nhánh thành công!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'branchs-controller',
            function: 'insertBranch',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi thêm Chi Nhánh"
        };
        res.json(result);
    }
}

function updateBranch(req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.branchs;
        const tableName = table.name;
        const columns = table.columns;
        const updatedDate = new Date();

        let conditions = {
            table: tableName,
            columns: {
                [columns.name]: body.name,
                [columns.code]: body.code,
                [columns.status]: body.status ? 1 : 0,
                [columns.updatedDate]: updatedDate,
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.branchId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi sửa Chi Nhánh!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Sửa Chi Nhánh thành công!",
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
            controller: 'branchs-controller',
            function: 'updateBranch',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi sửa Chi Nhánh!"
        };
        res.json(result);
    }
}

function deleteBranch(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.branchs;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.branchId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi xóa Chi Nhánh!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Xóa Chi Nhánh thành công!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'branchs-controller',
            function: 'deleteBranch',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Lỗi xóa Chi Nhánh!"
        };
        res.json(result);
    }
}

async function searchBranchs(req, res) {
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

        const conditions = `select count(branchId) as count from (
                            SELECT * FROM tbl_Branchs 
                            WHERE tbl_Branchs.branchCode LIKE ? AND tbl_Branchs.branchName LIKE ?
                            GROUP BY tbl_Branchs.branchId)as t`;
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
                data: [],
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get branchs successful!"
            };
        } else {
            const respBranchs = await new Promise(resolve => {
                const queryStr = `SELECT * FROM tbl_Branchs 
                                 WHERE tbl_Branchs.branchCode LIKE ? AND tbl_Branchs.branchName LIKE ?
                                 order by branchName LIMIT ?,?`;
                mysql.query(queryStr, [`%${code}%`, `%${name}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
                    resolve(resp);
                });
            });
            if (_.size(respBranchs) > 0) {
                result = {
                    status: 200,
                    data: {
                        data: respBranchs
                    },
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                    message: "Get branchs successful!"
                };
            } else {
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
                    message: "Get branchs successful!"
                };
            }
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'branchs-controller',
            function: 'searchBranchs',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Search Branchs failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getBranchs,
    insertBranch,
    updateBranch,
    deleteBranch,
    searchBranchs,
};