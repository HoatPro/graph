'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const base = require('../../base-controller');

function getAllLocation(req, res) {
    let result = [];
    try {
        mysql.query('select * from tbl_Locations order by locationName', null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all location successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllLocations_locations-controller', { error: err, data: {} });
        elk.error({
            controller: 'locations-controller',
            function: 'getAllLocations',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all location failed',
            data: []
        };
        res.json(result);
    }
}

async function getLocations(req, res) {
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
                let count = await mysql.query_transaction(connection, `select count(*) as count from tbl_Locations where locationName like ?`, [where]);
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
                        message: "Get locations successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const locations = await mysql.query_transaction(connection, `select * from tbl_Locations where locationName like ? order by createdDate desc limit ?, ?`, [where, from, pagination.sizePage]);
                    result = {
                        status: 200,
                        data: locations,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Locations successful!"
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
                controller: 'locations-controller',
                function: 'getLocations',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get Locations failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'locations-controller',
            function: 'getLocations',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getLocations failed!",
            data: [],
        };
        res.json(result);
    }
}

function getLocationById(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select * from tbl_Locations where locationId=?`, query.locationId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Locations failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Locations successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'locations-controller',
            function: 'getLocationById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get Locations failed!",
            data: []
        };
        res.json(result);
    }
}

async function insertLocation(req, res) {
    const body = req.body;
    let result = {};
    console.log('insert', body);
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
        const query = `insert into tbl_Locations (locationName, createdBy, description, createdDate) values ?`;

        mysql.query(query, [[[body.locationName, user.userId, body.description, createdDate]]], resp => {
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
                        locationId: resp.insertId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'locations-controller',
            function: 'insertLocation',
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

async function updateLocation(req, res) {
    const body = req.body;
    let result = {};
    console.log(body);
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
            locationName: body.locationName,
            description: body.description,
            updatedDate: new Date(),
            updatedBy: user.userId
        };
        const query = `update tbl_Locations set ? where locationId=?`;
        mysql.query(query, [data, body.locationId], resp => {
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
                        locationId: body.locationId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'locations-controller',
            function: 'updateLocation',
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

function deleteLocation(req, res) {
    const query = req.query;
    let result = {};
    try {
        mysql.query(`delete from tbl_Locations where locationId=?`, parseInt(query.id), resp => {
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
            controller: 'locations-controller',
            function: 'deleteLocation',
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
    if (!data.locationName) {
        return false;
    }

    return true;
}

module.exports = {
    getAllLocation,
    getLocations,
    insertLocation,
    updateLocation,
    deleteLocation,
    getLocationById
};