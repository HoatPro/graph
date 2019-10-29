'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllCustomers(req, res) {
    let result = [];
    try {
        mysql.query('select * from tbl_Customers order by customerName', null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all customer successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllCustomers_customers-controller', { error: err, data: {} });
        elk.error({
            controller: 'customers-controller',
            function: 'getAllCustomers',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all customer failed',
            data: []
        };
        res.json(result);
    }
}

async function getCustomers(req, res) {
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
                let count = await mysql.query_transaction(connection, `select count(*) as count from tbl_Customers where customerName like ?`, [where]);
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
                        message: "Get customers successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const customers = await mysql.query_transaction(connection, `select * from tbl_Customers
                        where customerName like ?
                        order by createdDate desc
                        limit ?, ?`, [where, from, pagination.sizePage]);
                    result = {
                        status: 200,
                        data: customers,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Customers successful!"
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
                controller: 'customers-controller',
                function: 'getCustomers',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "getCustomers failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'customers-controller',
            function: 'getCustomers',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getCustomers failed!",
            data: [],
        };
        res.json(result);
    }
}

function getCustomerById(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select * from tbl_Customers where customerId=?`, query.customerId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Customers failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Customers successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'customers-controller',
            function: 'getCustomerById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get Customers failed!",
            data: []
        };
        res.json(result);
    }
}

function insertCustomer(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        if (!validate(body)) {
            res.json(result = {
                status: 500,
                message: "Add Customer failed!"
            });
            return false;
        }
        const query = `insert into tbl_Customers (customerName, description, createdDate, status) values ?`;

        mysql.query(query, [[[body.customerName, body.description, createdDate, 1]]], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Add Customer failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Add Customer successful!",
                    data: {
                        customerId: resp.insertId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'customers-controller',
            function: 'insertCustomer',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add Customer failed!"
        };
        res.json(result);
    }
}

async function updateCustomer(req, res) {
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
            customerName: body.customerName,
            description: body.description,
            updatedDate: new Date(),
        };
        const query = `update tbl_Customers set ? where customerId=?`;
        mysql.query(query, [data, body.customerId], resp => {
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
                        customerId: body.customerId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'customers-controller',
            function: 'updateCustomer',
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

function deleteCustomer(req, res) {
    const query = req.query;
    let result = {};
    try {
        mysql.query(`delete from tbl_Customers where customerId=?`, parseInt(query.id), resp => {
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
            controller: 'customers-controller',
            function: 'deleteCustomer',
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
    if (!data.customerName) {
        return false;
    }

    return true;
}

module.exports = {
    getAllCustomers,
    getCustomers,
    insertCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById
};