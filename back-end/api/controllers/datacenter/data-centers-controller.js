'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const base = require('../../base-controller');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllLocation() {
    return new Promise(resolve => {
        let result = [];
        try {
            const locations = _var.tables.location;
            const columns = locations.columns;
            const conditions = {
                table: locations.name,
                order: {
                    column: columns.createdDate,
                    type: "DESC"
                },
            };

            mysql.search(conditions, (resp) => {
                let temp = [];
                if (!_.isNull(resp)) {
                    temp = resp;
                }
                resolve(temp);
            });
        } catch (error) {
            // console.error('getAllLocation_racks-controller', { error: err, data: {} });
            elk.error({
                controller: 'data-centers-controller',
                function: 'getAllLocation',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {}
            });
            resolve(result);
        }
    });
}

function getAllDataCenter() {
    return new Promise(resolve => {
        let result = [];
        try {
            const dataCenters = _var.tables.dataCenter;
            const columns = dataCenters.columns;
            const conditions = {
                table: dataCenters.name,
                order: {
                    column: columns.createdDate,
                    type: "DESC"
                },
            };

            mysql.search(conditions, (resp) => {
                let temp = [];
                if (!_.isNull(resp)) {
                    temp = resp;
                }
                resolve(temp);
            });
        } catch (error) {
            // console.error('getAllDataCenter_racks-controller', { error: err, data: {} });
            elk.error({
                controller: 'data-centers-controller',
                function: 'getAllDataCenter',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {}
            });
            resolve(result);
        }
    });
}

function getAllRoom() {
    return new Promise(resolve => {
        let result = [];
        try {
            const rooms = _var.tables.room;
            const columns = rooms.columns;
            const conditions = {
                table: rooms.name,
                order: {
                    column: columns.createdDate,
                    type: "DESC"
                },
            };

            mysql.search(conditions, (resp) => {
                let temp = [];
                if (!_.isNull(resp)) {
                    temp = resp;
                }
                resolve(temp);
            });
        } catch (error) {
            // console.error('getAllRoom_racks-controller', { error: err, data: {} });
            elk.error({
                controller: 'data-centers-controller',
                function: 'getAllRoom',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {}
            });
            resolve(result);
        }
    });
}

function getAllZone() {
    return new Promise(resolve => {
        let result = [];
        try {
            const zones = _var.tables.zone;
            const columns = zones.columns;
            const conditions = {
                table: zones.name,
                order: {
                    column: columns.createdDate,
                    type: "DESC"
                },
            };

            mysql.search(conditions, (resp) => {
                let temp = [];
                if (!_.isNull(resp)) {
                    temp = resp;
                }
                resolve(temp);
            });
        } catch (error) {
            // console.error('getAllZone_racks-controller', { error: err, data: {} });
            elk.error({
                controller: 'data-centers-controller',
                function: 'getAllZone',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {}
            });
            resolve(result);
        }
    });
}

function getDataCenterById(req, res) {
    const query = req.query;
    let result = {};
    let promises = [];
    try {
        const tables = _var.tables;
        const dataCenters = tables.dataCenter;
        const dataCentersColumns = dataCenters.columns;
        const conditions = {
            table: dataCenters.name,
            order: {
                tables: dataCenters.name,
                column: dataCentersColumns.createdDate,
                type: "DESC"
            },
            where: {
                and: [{column: `${dataCenters.name}.${dataCentersColumns.id}`, value: query.id, compare: '='}]
            }
        };
        promises.push(getAllRoom());
        promises.push(getAllZone());
        promises.push(new Promise(resolve => {
            mysql.search(conditions, resp => {
                resolve(resp);
            });
        }));
        Promise.all(promises).then(resp => {
            result = {
                status: 200,
                data: {
                    rooms: resp[0],
                    zones: resp[1],
                    dataCenters: resp[2]
                },
                message: "Get racks successful!"
            };
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'data-centers-controller',
            function: 'getDataCenterById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getRacks failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getDataCenterById
};