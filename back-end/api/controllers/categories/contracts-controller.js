'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllContract(req, res) {
    let result = [];
    try {
        mysql.query('select * from tbl_Contracts order by contractName', null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all contract successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllContracts_contracts-controller', { error: err, data: {} });
        elk.error({
            controller: 'contracts-controller',
            function: 'getAllContracts',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all contract failed',
            data: []
        };
        res.json(result);
    }
}

async function getContracts(req, res) {
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
                let count = await mysql.query_transaction(connection, `select count(*) as count from tbl_Contracts where contractName like ?`, [where]);
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
                        message: "Get contracts successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const contracts = await mysql.query_transaction(connection, `select * from tbl_Contracts where contractName like ? order by createdDate desc limit ?, ?`, [where, from, pagination.sizePage]);
                    result = {
                        status: 200,
                        data: contracts,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Contracts successful!"
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
                controller: 'contracts-controller',
                function: 'getContracts',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get Contracts failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'contracts-controller',
            function: 'getContracts',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getContracts failed!",
            data: [],
        };
        res.json(result);
    }
}

function getContractById(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select * from tbl_Contracts where contractId=?`, query.contractId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Contracts failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Contracts successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'contracts-controller',
            function: 'getContractById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get Contracts failed!",
            data: []
        };
        res.json(result);
    }
}

function insertContract(req, res) {
    const body = req.body;
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
        const query = `insert into tbl_Contracts (contractId, contractName, barcode, fullName, company, phone, createdDate, status) values ?`;

        mysql.query(query, [[[body.contractId, body.contractName, body.barcode, body.fullName, body.company, body.phone, createdDate, 1]]], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Insert failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Insert sucessful!",
                    data: {
                        contractId: resp.insertId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'contracts-controller',
            function: 'insertContract',
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

function updateContract(req, res) {
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
            contractName: body.contractName,
            barcode: body.barcode,
            fullName: body.fullName,
            company: body.company,
            phone: body.phone,
            updatedDate: new Date(),
            status: body.status
        };
        const query = `update tbl_Contracts set ? where contractId=?`;
        mysql.query(query, [data, body.contractId], resp => {
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
                        contractId: body.contractId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'contracts-controller',
            function: 'updateContract',
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

function deleteContract(req, res) {
    const query = req.query;
    let result = {};
    try {
        mysql.query(`delete from tbl_Contracts where contractId=?`, [query.id], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Remove successful!"
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
            controller: 'contracts-controller',
            function: 'deleteContract',
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
    if (!data.contractName) {
        return false;
    }

    return true;
}

module.exports = {
    getAllContract,
    getContracts,
    insertContract,
    updateContract,
    deleteContract,
    getContractById
};