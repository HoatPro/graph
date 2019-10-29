'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const base = require('../../base-controller');

function getAllDatacenters(req, res) {
    let result = [];
    try {
        mysql.query('select * from tbl_DataCenters order by dataCenterName', null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all datacenter successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllDatacenters_datacenters-controller', { error: err, data: {} });
        elk.error({
            controller: 'datacenters-controller',
            function: 'getAllDatacenters',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all datacenter failed',
            data: []
        };
        res.json(result);
    }
}

async function getDatacenters(req, res) {
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
                let _where = [];
                let dataWhere = [];

                if (_.size(search) > 0) {
                    const str = search.dataCenterName_dataCenterKey;
                    const locationId = search.locationId;

                    if (str) {
                        _where.push(`(dataCenterName like ? or dataCenterKey like ?)`);
                        dataWhere.push(`%${str}%`);
                        dataWhere.push(`%${str}%`);
                    }
                    if (locationId) {
                        _where.push(`tbl_DataCenters.locationId=?`);
                        dataWhere.push(locationId);
                    }
                }

                const where = _.size(_where) > 0 ? ` where ${_where.join(' and ')}` : '';
                let count = await mysql.query_transaction(connection, `select count(*) as count from tbl_DataCenters${where}`, dataWhere);
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
                        message: "Get datacenters successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const datacenters = await mysql.query_transaction(connection, `select dataCenterId, dataCenterName, totalRoom, dataCenterKey,
                        tbl_DataCenters.createdDate, tbl_DataCenters.createdBy, tbl_DataCenters.updatedDate, tbl_DataCenters.updatedBy,
                        tbl_DataCenters.description, tbl_DataCenters.locationId, tbl_Locations.locationName
                        from tbl_DataCenters 
                        join tbl_Locations on tbl_Locations.locationId=tbl_DataCenters.locationId
                        ${where}
                        order by tbl_DataCenters.createdDate desc
                        limit ?, ?`, [...dataWhere, from, pagination.sizePage]);
                    result = {
                        status: 200,
                        data: datacenters,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Data Center successful!"
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
                controller: 'datacenters-controller',
                function: 'getDatacenters',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get Data Center failed",
                data: []
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'datacenters-controller',
            function: 'getDatacenters',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Data Center failed",
            data: [],
        };
        res.json(result);
    }
}

function getDatacenterById(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select dataCenterId, dataCenterName, totalRoom, dataCenterKey,
            tbl_DataCenters.createdDate, tbl_DataCenters.createdBy, tbl_DataCenters.updatedDate, tbl_DataCenters.updatedBy,
            tbl_DataCenters.description, tbl_DataCenters.locationId, tbl_Locations.locationName
            from tbl_DataCenters
            join tbl_Locations on tbl_Locations.locationId=tbl_DataCenters.locationId
            where dataCenterId=?`, query.dataCenterId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Datacenters failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Datacenters successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'datacenters-controller',
            function: 'getDatacenterById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get Datacenters failed!",
            data: []
        };
        res.json(result);
    }
}

async function insertDatacenter(req, res) {
    const body = req.body;
    let result = {};
    const user = await base.getSession(req);
    try {
        const createdDate = new Date();
        if (!validate(body)) {
            res.json(result = {
                status: 500,
                message: "Insert failed!"
            });
            return false;
        }
        const query = `insert into tbl_DataCenters (dataCenterName, dataCenterKey, locationId, createdBy, description, createdDate) values ?`;

        mysql.query(query, [[[body.dataCenterName, body.dataCenterKey, body.locationId, user.userId, body.description, createdDate]]], resp => {
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
                        dataCenterId: resp.insertId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'datacenters-controller',
            function: 'insertDatacenter',
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

async function updateDatacenter(req, res) {
    const body = req.body;
    let result = {};
    const user = await base.getSession(req);
    try {
        if (!validate(body)) {
            res.json(result = {
                status: 500,
                message: "Update failed!"
            });
            return false;
        }
        let data = {
            dataCenterName: body.dataCenterName,
            dataCenterKey: body.dataCenterKey,
            description: body.description,
            locationId: body.locationId,
            updatedDate: new Date(),
            updatedBy: user.userId
        };
        const query = `update tbl_DataCenters set ? where dataCenterId=?`;
        mysql.query(query, [data, body.dataCenterId], resp => {
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
                        dataCenterId: body.dataCenterId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'datacenters-controller',
            function: 'updateDatacenter',
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

function deleteDatacenter(req, res) {
    const query = req.query;
    let result = {};
    try {
        mysql.query(`delete from tbl_DataCenters where dataCenterId=?`, parseInt(query.id), resp => {
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
            controller: 'datacenters-controller',
            function: 'deleteDatacenter',
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
    if (!data.dataCenterName) {
        return false;
    }

    if (!data.dataCenterKey) {
        return false;
    }

    if (!data.locationId) {
        return false;
    }

    return true;
}

module.exports = {
    getAllDatacenters,
    getDatacenters,
    insertDatacenter,
    updateDatacenter,
    deleteDatacenter,
    getDatacenterById
};