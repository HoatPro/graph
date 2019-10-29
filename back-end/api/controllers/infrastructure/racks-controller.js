'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const base = require('../../base-controller');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllRack(req, res) {
    let result = [];
    try {
        const racks = _var.tables.racks;
        const columns = racks.columns;
        const conditions = {
            table: racks.name,
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
            result = temp;
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllRack_racks-controller', { error: err, data: {} });
        elk.error({
            controller: 'racks-controller',
            function: 'getAllRack',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        res.json(result);
    }
}

function getAllContract() {
    return new Promise(resolve => {
        let result = [];
        try {
            const contracts = _var.tables.contracts;
            const columns = contracts.columns;
            const conditions = {
                table: contracts.name,
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
            // console.error('getAllContract_racks-controller', { error: err, data: {} });
            elk.error({
                controller: 'racks-controller',
                function: 'getAllContract',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {}
            });
            resolve([]);
        }
    });
}

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
                controller: 'racks-controller',
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
                controller: 'racks-controller',
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
                controller: 'racks-controller',
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
                controller: 'racks-controller',
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

function getAllDeviceType() {
    return new Promise(resolve => {
        let result = [];
        try {
            const deviceTypes = _var.tables.deviceTypes;
            const columns = deviceTypes.columns;
            const conditions = {
                table: deviceTypes.name,
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
            // console.error('getAllDeviceType_racks-controller', { error: err, data: {} });
            elk.error({
                controller: 'racks-controller',
                function: 'getAllDeviceType',
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

function getAllDeviceTemplate() {
    return new Promise(resolve => {
        let result = [];
        try {
            const deviceTemplates = _var.tables.deviceTemplates;
            const columns = deviceTemplates.columns;
            const conditions = {
                table: deviceTemplates.name,
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
            // console.error('getAllDeviceTemplate_racks-controller', { error: err, data: {} });
            elk.error({
                controller: 'racks-controller',
                function: 'getAllDeviceTemplate',
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

function getAllDepartment() {
    return new Promise(resolve => {
        let result = [];
        try {
            const departments = _var.tables.departments;
            const columns = departments.columns;
            const conditions = {
                table: departments.name,
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
            // console.error('getAllDepartment_racks-controller', { error: err, data: {} });
            elk.error({
                controller: 'racks-controller',
                function: 'getAllDepartment',
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

function getAllDeviceByRackId(id) {
    return new Promise(resolve => {
        let result = [];
        try {
            const tables = _var.tables;
            const devices = tables.devices;
            const devicesColumns = devices.columns;
            const conditions = {
                table: devices.name,
                order: {
                    column: devicesColumns.createdDate,
                    type: "DESC"
                },
                where: {
                    and: [{column: `${devices.name}.${devicesColumns.rackId}`, value: id, compare: '='}]
                }
            };

            mysql.search(conditions, (resp) => {
                if (!_.isNull(resp)) {
                    result = resp;
                }
                resolve(result);
            });
        } catch (error) {
            // console.error('getAllDeviceByRackId_racks-controller', { error: err, data: {} });
            elk.error({
                controller: 'racks-controller',
                function: 'getAllDeviceByRackId',
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

function getAllBookingUByRackId(id) {
    return new Promise(resolve => {
        let result = [];
        try {
            const tables = _var.tables;
            const bookingU = tables.bookingU;
            const bookingUColumns = bookingU.columns;
            const conditions = {
                table: bookingU.name,
                order: {
                    column: bookingUColumns.createdDate,
                    type: "DESC"
                },
                where: {
                    and: [{column: `${bookingU.name}.${bookingUColumns.rackId}`, value: id, compare: '='}]
                }
            };

            mysql.search(conditions, (resp) => {
                if (!_.isNull(resp)) {
                    result = resp;
                }
                resolve(result);
            });
        } catch (error) {
            // console.error('getAllBookingUByRackId_racks-controller', { error: err, data: {} });
            elk.error({
                controller: 'racks-controller',
                function: 'getAllBookingUByRackId',
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

function getRackById(req, res) {
    const query = req.query;
    let result = {};
    let promises = [];
    try {
        const tables = _var.tables;
        const racks = tables.racks;
        const racksColumns = racks.columns;
        const locations = tables.location;
        const locationsColumns = locations.columns;
        const dataCenters = tables.dataCenter;
        const dataCentersColumns = dataCenters.columns;
        const rooms = tables.room;
        const roomsColumns = rooms.columns;
        const zones = tables.zone;
        const zonesColumns = zones.columns;
        const conditions = {
            table: racks.name,
            order: {
                tables: racks.name,
                column: racksColumns.createdDate,
                type: "DESC"
            },
            select: [
                {
                    table: locations.name,
                    columns: [
                        {name: locationsColumns.id},
                        {name: locationsColumns.name},
                        {name: locationsColumns.key},
                    ]
                },
                {
                    table: dataCenters.name,
                    columns: [
                        {name: dataCentersColumns.id},
                        {name: dataCentersColumns.name},
                        {name: dataCentersColumns.key},
                    ]
                },
                {
                    table: rooms.name,
                    columns: [
                        {name: roomsColumns.id},
                        {name: roomsColumns.name},
                        {name: roomsColumns.codeRoom},
                    ]
                },
                {
                    table: zones.name,
                    columns: [
                        {name: zonesColumns.id},
                        {name: zonesColumns.name},
                    ]
                },
                {
                    table: racks.name,
                    columns: [
                        {name: racksColumns.id},
                        {name: racksColumns.name},
                        {name: racksColumns.model},
                        {name: racksColumns.uNumber},
                        {name: racksColumns.SNMP},
                        {name: racksColumns.maxPower},
                        {name: racksColumns.wattage},
                        {name: racksColumns.maxWeight},
                        {name: racksColumns.width},
                        {name: racksColumns.height},
                        {name: racksColumns.x},
                        {name: racksColumns.y},
                        {name: racksColumns.desc},
                        {name: racksColumns.createdDate},
                        {name: racksColumns.createdBy},
                        {name: racksColumns.updatedDate},
                        {name: racksColumns.updatedBy},
                        {name: racksColumns.status},
                    ]
                }
            ],
            join: {
                join: [
                    {
                        table: zones.name,
                        conditions: {[zones.name]: zonesColumns.id, [racks.name]: racksColumns.zoneId}
                    },
                    {
                        table: rooms.name,
                        conditions: {[rooms.name]: roomsColumns.id, [zones.name]: zonesColumns.roomId}
                    },
                    {
                        table: dataCenters.name,
                        conditions: {[dataCenters.name]: dataCentersColumns.id, [rooms.name]: roomsColumns.dataCenterId}
                    },
                    {
                        table: locations.name,
                        conditions: {
                            [locations.name]: locationsColumns.id,
                            [dataCenters.name]: dataCentersColumns.locationId
                        }
                    },
                ],
            },
            where: {
                and: [{column: `${racks.name}.${racksColumns.id}`, value: query.rackId, compare: '='}]
            }
        };
        promises.push(getAllDeviceType());
        promises.push(getAllDeviceTemplate());
        promises.push(getAllContract());
        promises.push(getAllDeviceByRackId(query.rackId));
        promises.push(getAllBookingUByRackId(query.rackId));
        promises.push(getAllDepartment());
        promises.push(new Promise(resolve => {
            mysql.search(conditions, resp => {
                resolve(resp);
            });
        }));
        Promise.all(promises).then(resp => {
            result = {
                status: 200,
                data: {
                    deviceTypes: resp[0],
                    deviceTemplates: resp[1],
                    contracts: resp[2],
                    devices: resp[3],
                    bookingUs: resp[4],
                    department: resp[5],
                    rack: resp[6],
                },
                message: "Get racks successful!"
            };
            res.json(result);
        })
    } catch (error) {
        // console.error('getRacks_racks-controller', { error: err, data: {} });
        elk.error({
            controller: 'racks-controller',
            function: 'getRackById',
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

async function getRacks(req, res) {
    const query = req.query;
    let result = {};
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const tables = _var.tables;
        const racks = tables.racks;
        const racksColumns = racks.columns;
        const locations = tables.location;
        const locationsColumns = locations.columns;
        const dataCenters = tables.dataCenter;
        const dataCentersColumns = dataCenters.columns;
        const rooms = tables.room;
        const roomsColumns = rooms.columns;
        const zones = tables.zone;
        const zonesColumns = zones.columns;

        const conditions = {
            table: racks.name,
            order: {
                tables: racks.name,
                column: racksColumns.createdDate,
                type: "ASC"
            },
        };

        // count all records of racks
        const count = await new Promise(resolve => {
            mysql.count(conditions, resp => {
                resolve(resp);
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
                message: "Get racks successful!"
            };
        } else {
            // get racks by pagination
            const respRacks = await new Promise(resolve => {
                const temp = {
                    ...conditions,
                    select: [
                        {
                            table: rooms.name,
                            columns: [
                                {name: roomsColumns.id},
                                {name: roomsColumns.name},
                            ]
                        },
                        {
                            table: zones.name,
                            columns: [
                                {name: zonesColumns.id},
                                {name: zonesColumns.name},
                            ]
                        },
                        {
                            table: racks.name,
                            columns: [
                                {name: racksColumns.id},
                                {name: racksColumns.name},
                                {name: racksColumns.model},
                                {name: racksColumns.uNumber},
                                {name: racksColumns.SNMP},
                                {name: racksColumns.maxPower},
                                {name: racksColumns.wattage},
                                {name: racksColumns.maxWeight},
                                {name: racksColumns.width},
                                {name: racksColumns.height},
                                {name: racksColumns.x},
                                {name: racksColumns.y},
                                {name: racksColumns.desc},
                                {name: racksColumns.createdDate},
                                {name: racksColumns.createdBy},
                                {name: racksColumns.updatedDate},
                                {name: racksColumns.updatedBy},
                                {name: racksColumns.status},
                            ]
                        }
                    ],
                    join: {
                        left: [
                            {
                                table: zones.name,
                                conditions: {[zones.name]: zonesColumns.id, [racks.name]: racksColumns.zoneId}
                            },
                            {
                                table: rooms.name,
                                conditions: {[rooms.name]: roomsColumns.id, [zones.name]: zonesColumns.roomId}
                            },
                            {
                                table: dataCenters.name,
                                conditions: {
                                    [dataCenters.name]: dataCentersColumns.id,
                                    [rooms.name]: roomsColumns.dataCenterId
                                }
                            },
                            {
                                table: locations.name,
                                conditions: {
                                    [locations.name]: locationsColumns.id,
                                    [dataCenters.name]: dataCentersColumns.locationId
                                }
                            },
                        ]
                    },
                    limit: {
                        from: pagination.currentPage * pagination.sizePage,
                        size: pagination.sizePage
                    }
                };
                mysql.search(temp, resp => {
                    resolve(resp);
                });
            });
            // get others by rackId
            if (_.size(respRacks) > 0) {
                result = {
                    status: 200,
                    data: formatData(respRacks),
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                    message: "Get racks successful!"
                };
            } else {
                result = {
                    status: 200,
                    data: [],
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                    message: "Get racks successful!"
                };
            }
        }
        res.json(result);
    } catch (error) {
        // console.error('getRacks_racks-controller', { error: err, data: {} });
        elk.error({
            controller: 'racks-controller',
            function: 'getRacks',
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

async function getOthers(req, res) {
    let result = {
        status: 200,
        data: {
            locations: [],
            dataCenters: [],
            rooms: [],
            zones: []
        }
    };
    try {
        result.data.locations = await getAllLocation();
        result.data.dataCenters = await getAllDataCenter();
        result.data.rooms = await getAllRoom();
        result.data.zones = await getAllZone();
        res.json(result);
    } catch (error) {
        // console.error('getOthers_racks-controller', { error: e, data: {} });
        elk.error({
            controller: 'racks-controller',
            function: 'getOthers',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result.status = 500;
        res.json(result);
    }
}

async function insertRack(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const racks = _var.tables.racks;
        const racksColumns = racks.columns;
        const user = await base.getSession(req);
        // if(_.size(user) === 0) {
        //     result = {
        //         status: 500,
        //         message: "Add Device template failed!"
        //     };
        //     res.json(result);
        //     return false;
        // }
        let conditions = {
            table: racks.name,
            columns: {
                [racksColumns.name]: body.name,
                [racksColumns.model]: body.model,
                [racksColumns.uNumber]: body.uNumber,
                [racksColumns.SNMP]: body.SNMP,
                [racksColumns.maxPower]: body.maxPower,
                [racksColumns.wattage]: body.wattage,
                [racksColumns.maxWeight]: body.maxWeight,
                [racksColumns.zoneId]: body.zoneId,
                [racksColumns.x]: body.x,
                [racksColumns.y]: body.y,
                [racksColumns.width]: body.width,
                [racksColumns.height]: body.height,
                [racksColumns.rackWidth]: body.rackWidth,
                [racksColumns.rackHeight]: body.rackHeight,
                [racksColumns.rackDepth]: body.rackDepth,
                [racksColumns.desc]: body.desc,
                [racksColumns.status]: body.status ? 1 : 0,
                [racksColumns.createdDate]: createdDate,
                [racksColumns.createdBy]: user.userId,
            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Add Rack failed!"
                };
            } else {
                conditions.columns.rackId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Add Rack successful!",
                    data: conditions.columns
                };
                res.json(result);
            }
        });
    } catch (error) {
        // console.error('addRack_racks-controller', { error: e, data: body });
        elk.error({
            controller: 'racks-controller',
            function: 'insertRack',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add Rack failed!"
        };
        res.json(result);
    }
}

async function updateRack(req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const racks = tables.racks;
        const racksColumns = racks.columns;
        const updatedDate = new Date();
        const user = await base.getSession(req);
        // if(_.size(user) === 0) {
        //     result = {
        //         status: 500,
        //         message: "Add Device template failed!"
        //     };
        //     res.json(result);
        //     return false;
        // }
        let conditions = {
            table: racks.name,
            columns: {
                [racksColumns.name]: body.name,
                [racksColumns.model]: body.model,
                [racksColumns.uNumber]: body.uNumber,
                [racksColumns.SNMP]: body.SNMP,
                [racksColumns.maxPower]: body.maxPower,
                [racksColumns.wattage]: body.wattage,
                [racksColumns.maxWeight]: body.maxWeight,
                [racksColumns.zoneId]: body.zoneId,
                [racksColumns.x]: body.x,
                [racksColumns.y]: body.y,
                [racksColumns.width]: body.width,
                [racksColumns.height]: body.height,
                [racksColumns.rackWidth]: body.rackWidth,
                [racksColumns.rackHeight]: body.rackHeight,
                [racksColumns.rackDepth]: body.rackDepth,
                [racksColumns.desc]: body.desc,
                [racksColumns.status]: body.status ? 1 : 0,
                [racksColumns.updatedDate]: updatedDate,
                [racksColumns.createdBy]: user.userId,
            },
            where: {
                and: [
                    {column: `${racks.name}.${racksColumns.id}`, value: body.rackId, compare: '='}
                ]
            }
        };
        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Update Rack failed!"
                };
                res.json(result);
            } else {
                result = {
                    status: 200,
                    message: "Update Rack successful!",
                    data: {
                        ...body,
                        updatedDate: updatedDate
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        // console.error('updateRack_racks-controller', { error: e, data: body });
        elk.error({
            controller: 'racks-controller',
            function: 'updateRack',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update Rack failed!"
        };
        res.json(result);
    }
}

function deleteRack(req, res) {
    const body = req.query;
    let result = {};
    try {
        const table = _var.tables.racks;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.rackId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete Rack failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete Rack successful!",
                    data: {
                        rackId: parseInt(body.rackId)
                    }
                };
            }
            res.json(result);
        })
    } catch (error) {
        // console.error('deleteRack_racks-controller', { error: e, data: body });
        elk.error({
            controller: 'racks-controller',
            function: 'deleteRack',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Delete Rack failed!"
        };
        res.json(result);
    }
}

function pushNewItem(item) {
    let temp = {...item};
    delete temp.operationId;
    delete temp.operationName;
    delete temp.operationKey;
    temp.operations = [
        {
            operationId: item.operationId,
            operationName: item.operationName,
            operationKey: item.operationKey,
        }
    ];
    return temp;
}

function formatData(data) {
    let result = [];
    _.forEach(data, item => {
        if (_.size(result) === 0) {
            const temp = pushNewItem(item);
            result.push(temp);
        } else {
            const index = _.findIndex(result, {"rackId": item.rackId, "routeId": item.routeId});
            if (index === -1) {
                const temp = pushNewItem(item);
                result.push(temp);
            } else {
                const old = result[index];
                old.operations.push({
                    operationId: item.operationId,
                    operationName: item.operationName,
                    operationKey: item.operationKey,
                })
            }
        }
    });

    return result;
}

async function getSelectDevice(req, res) {
    let result = {
        deviceTypes: [],
        deviceTemplates: []
    };
    try {
        result = {
            deviceTypes: await getAllDeviceType(),
            deviceTemplates: await getAllDeviceTemplate()
        };
        res.json(result);
    } catch (error) {
        // console.error('getSelectDevice_racks-controller', { error: e, data: {} });
        elk.error({
            controller: 'racks-controller',
            function: 'getSelectDevice',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: "Delete Select device failed!"
        };
        res.json(result);
    }
}

function checkDevice(data) {

}

async function putDeviceOnRack(req, res) {
    const body = req.body;
    let result = [];
    try {
        const tables = _var.tables;
        const devices = tables.devices;
        const devicesColumns = devices.columns;
        const createdDate = new Date();
        const user = await base.getSession(req);
        const conditions = {
            table: devices.name,
            columns: {
                [devicesColumns.name]: body.name,
                [devicesColumns.label]: body.label,
                [devicesColumns.deviceTemplateId]: body.deviceTemplateId,
                [devicesColumns.contractId]: body.contractId,
                [devicesColumns.connectorNumber]: body.connectorNumber,
                [devicesColumns.position]: body.position,
                [devicesColumns.positionU]: body.positionU,
                [devicesColumns.endPositionU]: body.endPositionU,
                [devicesColumns.rackId]: body.rackId,
                // [devicesColumns.departmentId]: body.departmentId,
                [devicesColumns.status]: body.status ? 1 : 0,
                [devicesColumns.createdDate]: createdDate,
                [devicesColumns.createdBy]: user.userId,
            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Add device failed!"
                };
            } else {
                conditions.columns.deviceId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Add device successful!",
                    data: conditions.columns
                };
                res.json(result);
            }
        });
    } catch (error) {
        // console.error('putDeviceOnRack_racks-controller', { error: e, data: {} });
        elk.error({
            controller: 'racks-controller',
            function: 'putDeviceOnRack',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add device failed!"
        };
        res.json(result);
    }
}

async function bookingU(req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const bookingU = tables.bookingU;
        const bookingUColumns = bookingU.columns;
        const createdDate = new Date();
        const user = await base.getSession(req);
        // if(_.size(user) === 0) {
        //     result = {
        //         status: 500,
        //         message: "Booking U failed!"
        //     };
        //     res.json(result);
        //     return false;
        // }
        const conditions = {
            table: bookingU.name,
            columns: {
                [bookingUColumns.position]: body.position,
                [bookingUColumns.positionU]: body.positionU,
                [bookingUColumns.rackId]: body.rackId,
                [bookingUColumns.height]: body.height,
                [bookingUColumns.desc]: body.desc,
                [bookingUColumns.createdDate]: createdDate,
                [bookingUColumns.createdBy]: user.userId,
            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Booking U failed!"
                };
            } else {
                conditions.columns.bookingUId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Booking U successful!",
                    data: conditions.columns
                };
                res.json(result);
            }
        })

    } catch (error) {
        // console.error('bookingU_racks-controller', { error: e, data: {} });
        elk.error({
            controller: 'racks-controller',
            function: 'bookingU',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add device failed!"
        };
        res.json(result);
    }
}

function deleteDevice(req, res) {
    const body = req.query;
    let result = {};
    try {
        const tables = _var.tables;
        const devices = tables.devices;
        const devicesColumns = devices.columns;

        let conditions = {
            table: devices.name,
            where: {
                and: [
                    {column: `${devices.name}.${devicesColumns.id}`, value: body.deviceId, compare: '='}
                ]
            }
        };


        mysql.delete(conditions, resp => {

            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: "Remove device failed!",
                };
            } else {
                result = {
                    status: 200,
                    message: "Remove device successful!",
                    data: {
                        deviceId: parseInt(body.deviceId)
                    }
                };
            }
            res.json(result);
        })
    } catch (error) {
        // console.error('deleteDevice_racks-controller', { error: e, data: body });
        elk.error({
            controller: 'racks-controller',
            function: 'deleteDevice',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Remove device failed!"
        };
        res.json(result);
    }
}

function deleteBooking(req, res) {
    const body = req.query;
    let result = {};
    try {
        const tables = _var.tables;
        const bookingU = tables.bookingU;
        const bookingUColumns = bookingU.columns;
        let conditions = {
            table: bookingU.name,
            where: {
                and: [
                    {column: `${bookingU.name}.${bookingUColumns.id}`, value: body.bookingUId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {

            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: "Remove booking failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Remove booking successful!",
                    data: {
                        bookingUId: parseInt(body.bookingUId)
                    }
                };
            }
            res.json(result);
        })
    } catch (error) {
        // console.error('deleteDeviceBooking_racks-controller', { error: e, data: body });
        elk.error({
            controller: 'racks-controller',
            function: 'deleteBooking',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Remove booking failed!"
        };
        res.json(result);
    }
}

function getRacksByZone(req, res) {
    const query = req.query;
    let result = {};
    try {
        const tables = _var.tables;
        const racks = tables.racks;
        const racksColumns = racks.columns;
        const conditions = {
            table: racks.name,
            order: {
                tables: racks.name,
                column: racksColumns.createdDate,
                type: "DESC"
            },
            where: {
                and: [{column: `${racks.name}.${racksColumns.zoneId}`, value: query.zoneId, compare: '='}]
            }
        };
        mysql.search(conditions, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get racks failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get racks successful!"
                };
            }
            res.json(result);
        });
    } catch (error) {
        // console.error('getRacks_racks-controller', { error: e, data: {} });
        elk.error({
            controller: 'racks-controller',
            function: 'getRacksByZone',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getRacks failed!",
            data: []
        };
        res.json(result);
    }
}


module.exports = {
    getRacks,
    getOthers,
    getAllRack,
    getRackById,
    getRacksByZone,
    getSelectDevice,
    putDeviceOnRack,
    bookingU,
    insertRack,
    updateRack,
    deleteRack,
    deleteDevice,
    deleteBooking,
};