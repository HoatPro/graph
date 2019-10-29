'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const base = require('../../base-controller');

function getAllRegion(req, res) {
    let result = [];
    try {
        mysql.query('select * from tbl_Regions order by regionName', null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all region successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllRegions_regions-controller', { error: err, data: {} });
        elk.error({
            controller: 'regions-controller',
            function: 'getAllRegions',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all region failed',
            data: []
        };
        res.json(result);
    }
}

async function getRegions(req, res) {
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
                let count = await mysql.query_transaction(connection, `select count(*) as count from tbl_Regions where regionName like ?`, [where]);
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
                        message: "Get regions successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const regions = await mysql.query_transaction(connection, `select regionId, regionName,
                        r.createdDate, r.updatedDate,
                        r.description, r.departmentId, d.departmentName
                        from tbl_Regions as r
                        join tbl_Departments as d on d.departmentId=r.departmentId
                        where regionName like ?
                        order by r.createdDate desc
                        limit ?, ?`, [where, from, pagination.sizePage]);
                    result = {
                        status: 200,
                        data: regions,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Regions successful!"
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
                controller: 'regions-controller',
                function: 'getRegions',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Lỗi tạo phiếu Đặt hàng"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'regions-controller',
            function: 'getRegions',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getRegions failed!",
            data: [],
        };
        res.json(result);
    }
}

function getRegionById(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select regionId, regionName,
            r.createdDate, r.updatedDate,
            r.description, r.departmentId, d.departmentName
            from tbl_Regions as r
            join tbl_Departments as d on d.departmentId=r.departmentId
            where regionId=?`, query.regionId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Regions failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Regions successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'regions-controller',
            function: 'getRegionById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get Regions failed!",
            data: []
        };
        res.json(result);
    }
}

function insertRegion(req, res) {
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
        const query = `insert into tbl_Regions (regionName, departmentId, description, createdDate, status) values ?`;

        mysql.query(query, [[[body.regionName, body.departmentId, body.description, createdDate, 1]]], resp => {
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
                        regionId: resp.insertId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'regions-controller',
            function: 'insertRegion',
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

async function updateRegion(req, res) {
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
            regionName: body.regionName,
            description: body.description,
            departmentId: body.departmentId,
            updatedDate: new Date(),

        };
        const query = `update tbl_Regions set ? where regionId=?`;
        mysql.query(query, [data, body.regionId], resp => {
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
                        regionId: body.regionId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'regions-controller',
            function: 'updateRegion',
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

function deleteRegion(req, res) {
    const query = req.query;
    let result = {};
    try {
        mysql.query(`delete from tbl_Regions where regionId=?`, parseInt(query.id), resp => {
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
            controller: 'regions-controller',
            function: 'deleteRegion',
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
    if (!data.regionName) {
        return false;
    }

    if (!data.departmentId) {
        return false;
    }

    return true;
}

module.exports = {
    getAllRegion,
    getRegions,
    insertRegion,
    updateRegion,
    deleteRegion,
    getRegionById
};