'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');


function getAllDepartment(req, res) {
    let result = [];
    try {
        mysql.query('select * from tbl_Departments order by departmentName', null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all department successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllDepartments_departments-controller', { error: err, data: {} });
        elk.error({
            controller: 'departments-controller',
            function: 'getAllDepartments',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all department failed',
            data: []
        };
        res.json(result);
    }
}

async function getDepartments(req, res) {
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

                // count rows
                const where = `%${search.str ? search.str : ''}%`;
                let count = await mysql.query_transaction(connection, `select count(*) as count from tbl_Departments where departmentName like ?`, [where]);
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
                        message: "Get departments successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const departments = await mysql.query_transaction(connection, `select * from tbl_Departments
                        where departmentName like ?
                        order by createdDate desc
                        limit ?, ?`, [where, from, pagination.sizePage]);
                    result = {
                        status: 200,
                        data: departments,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Departments successful!"
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
                controller: 'departments-controller',
                function: 'getDepartments',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "getDepartments failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'departments-controller',
            function: 'getDepartments',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getDepartments failed!",
            data: [],
        };
        res.json(result);
    }
}

function getDepartmentById(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select * from tbl_Departments where departmentId=?`, query.departmentId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Departments failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Departments successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'departments-controller',
            function: 'getDepartmentById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get Departments failed!",
            data: []
        };
        res.json(result);
    }
}

function insertDepartment(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        if (!validate(body)) {
            res.json(result = {
                status: 500,
                message: "Add Department failed!"
            });
            return false;
        }
        const query = `insert into tbl_Departments (departmentName, description, createdDate) values ?`;

        mysql.query(query, [[[body.departmentName, body.description, createdDate]]], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Add Department failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Add Department successful!",
                    data: {
                        departmentId: resp.insertId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'departments-controller',
            function: 'insertDepartment',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add Department failed!"
        };
        res.json(result);
    }
}

function updateDepartment(req, res) {
    const body = req.body;
    let result = {};
    try {
        if (!validate(body)) {
            res.json(result = {
                status: 500,
                message: "Update failed!"
            });
            return false;
        }
        let data = {
            departmentName: body.departmentName,
            description: body.description,
            updatedDate: new Date(),
        };
        const query = `update tbl_Departments set ? where departmentId=?`;
        mysql.query(query, [data, body.departmentId], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Update failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Update successful!",
                    data: {
                        ...data,
                        departmentId: body.departmentId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'departments-controller',
            function: 'updateDepartment',
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

function deleteDepartment(req, res) {
    const query = req.query;
    let result = {};
    try {
        mysql.query(`delete from tbl_Departments where departmentId=?`, parseInt(query.id), resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Remove failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Remove successful!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'departments-controller',
            function: 'deleteDepartment',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Remove failed!"
        };
        res.json(result);
    }
}

function validate(data) {
    if (!data.departmentName) {
        return false;
    }

    return true;
}

module.exports = {
    getAllDepartment,
    getDepartments,
    insertDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById
};