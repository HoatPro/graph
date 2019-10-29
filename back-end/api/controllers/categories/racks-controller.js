'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const type = _var.logConfig.type;
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const base = require('../../base-controller');

function getAllRack(req, res) {
    let result = [];
    try {
        mysql.query(`select r.rackId,r.rackName,r.model,r.uNumber,r.SNMP,r.maxPower,r.wattage,r.maxWeight,r.width,r.height,r.x,r.y,r.description,
r.updatedBy,r.createdDate,r.updatedDate,r.status,r.rackHeight,r.rackWidth,r.rackDepth,r.createdBy,
                            z.zoneId, z.zoneName, 
                            rm.roomId, rm.roomName, 
                            dc.dataCenterName,dc.dataCenterId,
                            l.locationId,l.locationName
                            from tbl_Racks as r
                            join tbl_Zones as z on z.zoneId=r.zoneId
                            join tbl_Rooms as rm on rm.roomId=z.roomId
                            join tbl_DataCenters as dc on rm.dataCenterId=dc.dataCenterId
                            join tbl_Locations as l on dc.locationId=l.locationId`, null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all rack successful',
                data: temp
            };
            res.json(result);
        });
    } catch (err) {
        // console.error('getAllRacks_racks-controller', { error: err, data: {} });
        elk.error({
            controller: 'racks-controller',
            function: 'getAllRacks',
            error: err,
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all rack failed',
            data: []
        };
        res.json(result);
    }
}

async function getRacks(req, res) {
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
                    const str = search.rackName;
                    const locationId = search.locationId;
                    const dataCenterId = search.dataCenterId;
                    const roomId = search.roomId;
                    const zoneId = search.zoneId;
                    if (str) {
                        _where.push(`r.rackName like ?`);
                        dataWhere.push(`%${str}%`);
                    }
                    if (locationId) {
                        _where.push(`l.locationId=?`);
                        dataWhere.push(locationId);
                    }
                    if (dataCenterId) {
                        _where.push(`dc.dataCenterId=?`);
                        dataWhere.push(dataCenterId);
                    }
                    if (roomId) {
                        _where.push(`rm.roomId=?`);
                        dataWhere.push(roomId);
                    }
                    if (zoneId) {
                        _where.push(`z.zoneId=?`);
                        dataWhere.push(zoneId)
                    }
                }
                const where = _.size(_where) > 0 ? ` where ${_where.join(' and ')}` : '';
                let count = await mysql.query_transaction(connection, `select count(*) as count
                                                                            from tbl_Racks as r
                                                                            join tbl_Zones as z on z.zoneId=r.zoneId
                                                                            join tbl_Rooms as rm on rm.roomId=z.roomId
                                                                            join tbl_DataCenters as dc on rm.dataCenterId=dc.dataCenterId
                                                                            join tbl_Locations as l on dc.locationId=l.locationId
                                                                            ${where}`, dataWhere);
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
                        message: "Get racks successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const racks = await mysql.query_transaction(connection, `select r.rackId,r.rackName,r.model,r.uNumber,r.SNMP,r.maxPower,r.wattage,r.maxWeight,r.width,r.height,r.x,r.y,r.description,
                                                                                    r.updatedBy,r.createdDate,r.updatedDate,r.status,r.rackHeight,r.rackWidth,r.rackDepth,r.createdBy,
                                                                                    z.zoneId, z.zoneName, 
                                                                                    rm.roomId, rm.roomName, 
                                                                                    dc.dataCenterName,dc.dataCenterId, 
                                                                                    l.locationId,l.locationName
                                                                                    from tbl_Racks as r
                                                                                    join tbl_Zones as z on r.zoneId=z.zoneId
                                                                                    join tbl_Rooms as rm on z.roomId=rm.roomId
                                                                                    join tbl_DataCenters as dc on rm.dataCenterId=dc.dataCenterId
                                                                                    join tbl_Locations as l on dc.locationId=l.locationId
                                                                                    ${where}
                                                                                    order by r.createdDate desc
                                                                                    limit ?, ?`, [...dataWhere, from, pagination.sizePage]);
                    result = {
                        status: 200,
                        data: racks,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Racks successful!"
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
                controller: 'racks-controller',
                function: 'getRacks',
                error: error,
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get racks failed"
            };
            res.json(result);
        }
    } catch (err) {
        elk.error({
            controller: 'racks-controller',
            function: 'getRacks',
            error: err,
            data: query
        });
        result = {
            status: 500,
            message: "Get racks failed!",
            data: [],
        };
        res.json(result);
    }
}

function getRackById(req, res) {
    let result = {};
    const query = req.query;
    try {
        const rack = new Promise(resolve => {
            mysql.query(`select rackId, rackName, model, uNumber, SNMP, maxPower, wattage, maxWeight,
                                r.width, r.height, r.x, r.y, r.description, r.status, rackWidth, rackHeight, rackDepth,
                                r.createdDate, r.updatedDate, l.locationId, locationName, dc.dataCenterId, dataCenterName, dataCenterKey,
                                rm.roomId, roomName, rm.codeRoom, z.zoneId, zoneName, rm.image
                                from tbl_Racks as r
                                join tbl_Zones as z on r.zoneId=z.zoneId
                                join tbl_Rooms as rm on rm.roomId=z.roomId
                                join tbl_DataCenters as dc on rm.dataCenterId=dc.dataCenterId
                                join tbl_Locations as l on dc.locationId=l.locationId
                                where rackId=?`, query.rackId, resp => {
                let temp = {};
                if (!_.isNull(resp)) {
                    temp = resp[0];
                }
                resolve(temp);
            });
        });
        const bookingUs = new Promise(resolve => {
            mysql.query(`select * from tbl_Racks_BookingUs where rackId=?`, query.rackId, resp => {
                let temp = [];
                if (!_.isNull(resp)) {
                    temp = resp;
                }
                resolve(temp);
            });
        });
        const devices = new Promise(resolve => {
            mysql.query(`select * from tbl_Racks_Devices where rackId=?`, query.rackId, resp => {
                let temp = [];
                if (!_.isNull(resp)) {
                    temp = resp;
                }
                resolve(temp);
            });
        });
        Promise.all([rack, bookingUs, devices]).then(resp => {
            res.json({
                status: 200,
                data: {
                    ...resp[0],
                    bookingUs: resp[1],
                    devices: resp[2]
                }
            })
        });
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'getRackById',
            error: e,
            data: {}
        });
        result = {
            status: 500,
            message: "Get Racks failed!",
            data: {}
        };
        res.json(result);
    }
}

function getRackByZone(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select * from tbl_Racks where zoneId=?`, query.zoneId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Racks failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Racks successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'getRackByZone',
            error: error,
            data: []
        });
        result = {
            status: 500,
            message: "Get Racks failed!",
            data: []
        };
        res.json(result);
    }
}

async function insertRack(req, res) {
    const body = req.body;
    let result = {};
    try {
        const user = await base.getSession(req);
        const createdDate = new Date();
        if (!validate(body)) {
            res.json(result = {
                status: 500,
                message: "Add Rack failed!"
            });
            return false;
        }

        const query = `insert into tbl_Racks (rackName, model, uNumber, SNMP, maxPower, wattage, maxWeight, x, y, width, height, rackWidth, rackHeight, rackDepth, roomId, zoneId, description, status, createdDate, createdBy) values ?`;
        console.log('insertRack 1');
        mysql.query(query, [[[body.rackName, body.model, body.uNumber, body.SNMP, body.maxPower, body.wattage, body.maxWeight, body.x, body.y, body.width, body.height, body.rackWidth, body.rackHeight, body.rackDepth, body.roomId, body.zoneId, body.description, 1, createdDate, user.userId]]], resp => {
            console.log('insertRack resp', resp);

            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Add Rack failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Add Rack successful!",
                    data: {
                        ...body,
                        createdDate: createdDate,
                        rackId: resp.insertId,
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
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
    const user = await base.getSession(req);
    try {
        if (!validate(body)) {
            res.json(result = {
                status: 500,
                message: "Update failed!"
            });
            return false;
        }
        // rackName, model, uNumber, SNMP, maxPower, wattage, maxWeight, x, y, width, height, rackWidth, rackHeight, rackDepth, zoneId, description, status, createdDate, createdBy
        let data = {
            rackName: body.rackName,
            model: body.model,
            uNumber: body.uNumber,
            SNMP: body.SNMP,
            maxPower: body.maxPower,
            wattage: body.wattage,
            maxWeight: body.maxWeight,
            x: body.x,
            y: body.y,
            width: body.width,
            height: body.height,
            rackWidth: body.rackWidth,
            rackHeight: body.rackHeight,
            rackDepth: body.rackDepth,
            zoneId: body.zoneId,
            description: body.description,
            updatedDate: new Date(),
            updatedBy: user.userId
        };
        const query = `update tbl_Racks set ? where rackId=?`;
        mysql.query(query, [data, body.rackId], resp => {
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
                        rackId: body.rackId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'updateRack',
            error: e,
            data: body
        });
        result = {
            status: 500,
            message: "Update failed!"
        };
        res.json(result);
    }
}

function deleteRack(req, res) {
    const query = req.query;
    let result = {};
    try {
        mysql.query(`delete from tbl_Racks where rackId=?`, parseInt(query.id), resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Remove failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Remove successful!",
                    data: {
                        rackId: query.id
                    }
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'deleteRack',
            error: e,
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
    if (!data.rackName) {
        return false;
    }

    if (!data.zoneId) {
        return false;
    }

    return true;
}

function validateBookingU(data) {
    if (!data.positionU) {
        return false;
    }

    if (!data.height) {
        return false;
    }

    if (!data.description) {
        return false;
    }
    return true;
}

async function bookingU(req, res) {
    const body = req.body;
    let result = {};
    try {
        const user = await base.getSession(req);
        const createdDate = new Date();
        if (!validateBookingU(body)) {
            res.json(result = {
                status: 500,
                message: "Booking U failed!"
            });
            return false;
        }
        const query = `insert into tbl_Racks_BookingUs (rackId, position, positionU, description, height, createdDate, createdBy) values ?`;

        mysql.query(query, [[[body.rackId, body.position, body.positionU, body.description, body.height, createdDate, user.userId]]], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Booking U failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Booking U successful!",
                    data: {
                        ...body,
                        createdDate: createdDate,
                        bookingUId: resp.insertId,
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'bookingU',
            error: e,
            data: body
        });
        result = {
            status: 500,
            message: "Booking U failed!"
        };
        res.json(result);
    }
}

function validateAddDevice(data) {
    let regexIP = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");

    if (!data.deviceName) {
        return false;
    }

    if (!data.connectorNumber) {
        return false;
    }

    if (!data.deviceTypeId) {
        return false;
    }
    if (!data.deviceTemplateId) {
        return false;
    }
    if (!data.contractId) {
        return false;
    }
    // if(!data.ip) {
    //     return false;
    // } else if (!regexIP.test(data.ip)) {
    //     return false;
    // }

    if (!data.height) {
        return false;
    }
    return true;
}

async function addDeviceRack(req, res) {
    const body = req.body;
    let result = {};
    try {
        const user = await base.getSession(req);
        const createdDate = new Date();
        if (!validateAddDevice(body)) {
            res.json(result = {
                status: 500,
                message: "Add Device Rack failed!"
            });
            return false;
        }
        const label = `${body.dataCenterKey}.${body.contractId}.${body.codeRoom}.${body.rackName}.U${body.positionU}(${body.height})`; // dataCenterKey.MA HD.ROOM.TEN RACK. VI TRI(height)
        const query = `insert into tbl_Racks_Devices (rackId, deviceName, label, deviceTypeId, deviceTemplateId, 
                        connectorNumber, contractId, IP, position, positionU, height, createdDate, createdBy) values ?`;
        mysql.query(query, [[[body.rackId, body.deviceName, label, body.deviceTypeId, body.deviceTemplateId, parseInt(body.connectorNumber),
            body.contractId, body.ip, body.position, body.positionU, parseInt(body.height), createdDate, user.userId]]], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Add device rack failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Add device rack successful!",
                    data: {
                        ...body,
                        createdDate: createdDate,
                        deviceId: resp.insertId,
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'addDevice',
            error: e,
            data: body
        });
        result = {
            status: 500,
            message: "Add Device rack failed!"
        };
        res.json(result);
    }
}

function deleteBooking(req, res) {
    const query = req.query;
    let result = {};
    try {
        mysql.query(`delete from tbl_Racks_BookingUs where bookingUId=?`, parseInt(query.bookingUId), resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Remove Booking failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Remove Booking successful!",
                    data: {
                        bookingUId: query.id
                    }
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'deleteBooking',
            error: e,
            data: query
        });
        result = {
            status: 500,
            message: "Remove Booking failed!"
        };
        res.json(result);
    }
}

function deleteDeviceRack(req, res) {
    const query = req.query;
    let result = {};
    try {
        mysql.query(`delete from tbl_Racks_Devices where deviceId=?`, query.deviceId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Remove Device on Rack failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Remove Device on Rack successful!",
                    data: {
                        deviceId: query.deviceId
                    }
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'deleteDevice',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Remove Device on Rack failed!"
        };
        res.json(result);
    }
}

function validateMoveU(data) {
    if (!data.rackId) {
        return false;
    }
    if (!data.positionU) {
        return false;
    }
    return true
}

async function saveMoveU(req, res) {
    const body = req.body;
    let result = {};
    const user = await base.getSession(req);
    try {
        if (!validateMoveU(body)) {
            res.json(result = {
                status: 500,
                message: "Update failed!"
            });
            return false;
        }
        // rackName, model, uNumber, SNMP, maxPower, wattage, maxWeight, x, y, width, height, rackWidth, rackHeight, rackDepth, zoneId, description, status, createdDate, createdBy

        if (body.typeMove === 'Booking') {
            let data = {
                rackId: body.rackId,
                positionU: body.positionU,
                updatedDate: new Date(),
                updatedBy: user.userId
            };
            const query = `update tbl_Racks_BookingUs set ? where bookingUId=?`;
            mysql.query(query, [data, body.bookingUId], resp => {
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
                            ...body
                        }
                    };
                }
                res.json(result);
            });
        } else if (body.typeMove === 'Device') {
            let data = {
                rackId: body.rackId,
                positionU: body.positionU,
                updatedDate: new Date(),
                updatedBy: user.id || 21
            };
            const query = `update tbl_Racks_Devices set ? where deviceId=?`;
            mysql.query(query, [data, body.deviceId], resp => {
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
                            ...body
                        }
                    };
                }
                res.json(result);
            });
        }

    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'moveU',
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

function getDeviceById(req, res) {
    const query = req.query;
    try {
        mysql.query(`select * from tbl_Racks_Devices where deviceId=?`, [query.deviceId], resp => {
            let temp = {};
            if (!_.isNull(resp)) {
                temp = resp[0];
            }
            res.json({
                status: 200,
                message: "Get Device successful!",
                data: temp
            });
        });
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'getDeviceById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                query: query,
            }
        });
        res.json({
            status: 500,
            message: "Get Device failed!",
            data: {}
        });
    }
}

async function importDeviceToRack(req, res) {
    const body = req.body;
    let result = {};
    const user = await base.getSession(req);
    try {
        const connection = await mysql.transaction();
        const createdDate = new Date();
        // const
        let devices = body.devices;
        let error = [];
        let insertDeviceToRacks = [];
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();

                const _deviceTemplates = new Promise(resolve => {
                    mysql.query(`SELECT deviceTemplateId, deviceTemplateName, dtp.deviceTypeId, dt.deviceTypeName,
                                        dtp.weight, dtp.height
                                        FROM tbl_DeviceTemplates as dtp
                                        join tbl_DeviceTypes as dt on dtp.deviceTypeId=dt.deviceTypeId`, null, resp => {
                        let result = [];
                        if (!_.isNull(resp)) {
                            result = resp;
                        }
                        resolve(result);
                    });
                });

                const _rackBookings = new Promise(resolve => {
                    mysql.query(`SELECT r.rackId, rackName, uNumber, maxPower, maxWeight, roomId, zoneId, bookingUId, position, positionU, rb.height
                                        FROM tbl_Racks as r
                                        left join tbl_Racks_BookingUs as rb on r.rackId=rb.rackId`, null, resp => {
                        let result = [];
                        if (!_.isNull(resp)) {
                            result = resp;
                        }
                        resolve(result);
                    });
                });

                const _rackDevices = new Promise(resolve => {
                    mysql.query(`SELECT r.rackId, rackName, uNumber, r.maxPower, r.maxWeight, r.roomId, rm.roomName, zoneId, position, positionU, rd.height,
                                        deviceName, rd.deviceTypeId, dt.deviceTypeName, rd.deviceTemplateId, dtp.deviceTemplateName
                                        FROM tbl_Racks as r
                                        join tbl_Rooms as rm on r.roomId=rm.roomId
                                        left join tbl_Racks_Devices as rd on r.rackId=rd.rackId
                                        left join tbl_DeviceTypes as dt on rd.deviceTypeId=dt.deviceTypeId
                                        left join tbl_DeviceTemplates as dtp on rd.deviceTemplateId=dtp.deviceTemplateId`, null, resp => {
                        let result = [];
                        if (!_.isNull(resp)) {
                            result = resp;
                        }
                        resolve(result);
                    });
                });

                const _customers = new Promise(resolve => {
                    mysql.query(`SELECT * from tbl_Contracts`, null, resp => {
                        let result = [];
                        if (!_.isNull(resp)) {
                            result = resp;
                        }
                        resolve(result);
                    });
                });

                const temp = await Promise.all([_deviceTemplates, _rackBookings, _rackDevices, _customers]).then(resp => {
                    return {
                        deviceTemplates: resp[0],
                        rackBookings: resp[1],
                        rackDevices: resp[2],
                        customers: resp[3],
                    };
                });

                const deviceTemplates = temp.deviceTemplates;
                const rackBookings = temp.rackBookings;
                const rackDevices = temp.rackDevices;
                let customers = temp.customers;

                _.forEach(devices, d => {
                    const rackName = d.rack.toString().trim();
                    const deviceTemplateName = d.deviceTemplate.toString().trim();
                    const deviceName = d.deviceName.toString().trim();
                    // const deviceTypeName = d.deviceType.trim();
                    const room = d.room.toString().trim();
                    // const zone = d.zone;
                    const positionU = d.UPosition;
                    const contract = d.contract.toString().trim();

                    // rack exist
                    const rack = _.find(rackDevices, {rackName: rackName, roomName: room});
                    if (!rack) {
                        error.push(`Rack ${rackName} does not exist`);
                        return; // continue
                    }

                    // deviceTemplate exist
                    const deviceTemplate = _.find(deviceTemplates, {deviceTemplateName: deviceTemplateName});
                    if (!deviceTemplate) {
                        error.push(`Device template ${deviceTemplateName} does not exist`);
                        return; // continue
                    }

                    const bookingInRack = _.values(_.pickBy(rackBookings, {rackId: rack.rackId}));
                    const deviceInRack = _.values(_.pickBy(rackDevices, {rackId: rack.rackId}));
                    // check position
                    const check = checkPosition(bookingInRack, deviceInRack, positionU, deviceTemplate.height);

                    if (!check) {
                        error.push(`Device (${deviceName}) can't set position (${positionU}) in rack (${rack.rackName})`);
                        return; // continue7
                    }

                    // customer exist
                    const customerExist = _.find(customers, {contractId: contract});
                    if (!customerExist) {
                        error.push(`Contract (${contract}) doesn't exist`);
                        return; // continue7
                    }

                    insertDeviceToRacks.push([
                        deviceName,
                        deviceName,
                        deviceTemplate.deviceTemplateId,
                        customerExist.contractId,
                        createdDate,
                        1,
                        user.userId,
                        'front',
                        positionU,
                        rack.rackId,
                        deviceTemplate.height
                    ])
                });

                // insert contract
                // if(_.size(insertCustomers) > 0) await mysql.query_transaction(connection, 'insert into tbl_Contracts (contractName, createdDate, status) values ?', [insertCustomers]);

                // get all contract
                // customers = await mysql.query_transaction(connection, 'select * from tbl_Contracts', null);

                if (_.size(insertDeviceToRacks) > 0) {
                    const queryStr = `insert into tbl_Racks_Devices (deviceName, label, deviceTemplateId, contractId, createdDate, status, createdBy, position, positionU, rackId, height) values ?`;
                    const insert = await mysql.query_transaction(connection, queryStr, [insertDeviceToRacks]);

                    // insert device to rack
                    if (insert.affectedRows > 0) {
                        result = {
                            status: 200,
                            message: "Import Device to Rack successful!"
                        };
                    } else {
                        result = {
                            status: 500,
                            message: "Import Device to Rack failed!"
                        };
                    }
                } else {
                    result = {
                        status: 500,
                        message: "Import Device to Rack failed!"
                    };
                }

                if (_.size(error) > 0) {
                    result = {
                        status: 500,
                        message: error
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
                controller: 'racks-controller',
                function: 'importDeviceToRack',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {
                    body,
                    user
                }
            });
            result = {
                status: 500,
                message: "Import Device to Rack failed!"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'importDeviceToRack',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Import Device to Rack failed!"
        };
        res.json(result);
    }
}

function checkPosition(bookings = [], devices = [], position, height) {
    let result = true;

    // exist
    let posBookings = [];
    let posDevices = [];

    _.forEach(bookings, b => {
        let height = b.height;
        const positionU = b.positionU;

        let i = 0;
        while (height > 0) {
            posBookings.push(positionU - i);
            i++;
            height--;
        }
    });

    _.forEach(devices, b => {
        let height = b.height;
        const positionU = b.positionU;

        let i = 0;
        while (height > 0) {
            posDevices.push(positionU - i);
            i++;
            height--;
        }
    });

    const exist = _.concat(posBookings, posDevices);

    for (let i = 0; i < height; i++) {
        const pos = position - i;
        if (exist.indexOf(pos) > -1) {
            result = false;
            break;
        }
    }

    return result;
}

async function getRackByRoom(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select z.roomId, z.zoneId, z.zoneName, zg.zoneGroupId, zg.width as zoneGWidth, zg.height as zoneGHeight, zg.x as zoneGX, zg.y as zoneGY,
                            r.rackId, rackName, model, uNumber, SNMP, r.maxPower, maxWeight, wattage, r.width as dRackWidth, r.height as dRackHeight, 
                            r.x , r.y , r.description, r.createdDate, r.updatedDate, rackWidth, rackHeight, rackDepth,
                            dt.deviceTemplateName,dt.CPU,dt.RAM,dt.disk,dt.maxPower as dtMaxPower,dt.weight as dtWeight, dt.height as dtHeight, dt.manufacturer,dt.front,dt.rear,dt.powerModule,dt.HDD ,
                            con.contractName,con.fullName,con.company,con.phone,
                            rb.bookingUId,rb.rackId as rackIdBooking, rb.height as heightRackBooking,
                            rd.deviceId,rd.label,rd.deviceTemplateId ,rd.contractId,rd.IP,rd.height as heightRack,rd.typeServer
                            from tbl_Zones_Groups as zg
                            join tbl_Zones as z on z.zoneId=zg.zoneId
                            left join tbl_Racks as r on zg.zoneId=r.zoneId
                            left join tbl_Racks_BookingUs as rb on rb.rackId=r.rackId
                            left join tbl_Racks_Devices as rd on rd.rackId=r.rackId
                            left join tbl_DeviceTemplates as dt on dt.deviceTypeId=rd.deviceTypeId
                            left join tbl_Contracts as con on con.contractId=rd.contractId
                            where z.roomId=?`, query.roomId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Racks failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Racks successful!",
                    data: formatRacks(resp)
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'getRackByRoom',
            error: error,
            data: []
        });
        result = {
            status: 500,
            message: "Get Racks failed!",
            data: []
        };
        res.json(result);
    }
}

function getRackByZones(req, res) {
    let result = {};
    const query = req.query;
    try {
        let zoneId = query.zoneId;
        zoneId = _.isArray(zoneId) ? zoneId : [zoneId];
        mysql.query(`select * from tbl_Racks where zoneId=?`, query.zoneId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Racks failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Racks successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'getRackByZone',
            error: e,
            data: []
        });
        result = {
            status: 500,
            message: "Get Racks failed!",
            data: []
        };
        res.json(result);
    }
}

async function updateDraw(req, res) {
    const body = req.body;
    let result = {};
    const user = await base.getSession(req);
    try {
        const updatedDate = new Date;
        const updatedBy = user.userId;
        let racks = body.racks;
        let query = '';
        let data = [];

        if (!_.size(racks) === 0) {
            res.json(result = {
                status: 500,
                message: "The racks has not changed!"
            });
            return false;
        }

        _.forEach(racks, r => {
            data.push({x: r.x, y: r.y, width: r.width, height: r.height, updatedBy, updatedDate});
            data.push(r.rackId);
            query += `update tbl_Racks set ? where rackId=?;`;
        });

        mysql.query(query, data, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Update failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Update successful!",
                };
            }
            res.json(result);
        });

        elk.insert({
            controller: "racks-controller",
            function: 'updateDraw',
            type: type.updateDraw,
            data: {
                body: body,
                user: user,
            }
        }, respLog => {
            // console.log(respLog);
        });
    } catch (error) {
        elk.error({
            controller: 'racks-controller',
            function: 'updateDraw',
            error: e,
            data: body
        });
        result = {
            status: 500,
            message: "Update failed!"
        };
        res.json(result);
    }
}

function formatRacks(data) {
    console.log(data);
    let counts = [];

    data.forEach(function (a) {
        if (!this[a.rackId]) {
            this[a.rackId] = {rackId: a.rackId, dtWeight: 0, dtHeight: 0, dtMaxPower: 0};
            counts.push(this[a.rackId]);
        }
        this[a.rackId].dtWeight += a.dtWeight;
        this[a.rackId].dtHeight += a.dtHeight;
        this[a.rackId].dtMaxPower += a.dtMaxPower;
    }, Object.create(null));


    let result = [];
    _.forEach(data, item => {
        let zone = _.find(result, {zoneGroupId: item.zoneGroupId});
        if (!zone) {
            zone = {
                roomId: item.roomId,
                zoneName: item.zoneName,
                zoneGroupId: item.zoneGroupId,
                zoneId: item.zoneId,
                width: item.zoneGWidth,
                height: item.zoneGHeight,
                x: item.zoneGX,
                y: item.zoneGY,
                racks: []
            };
            result.push(zone);
        }
        let racks = zone.racks;
        let rack = _.find(racks, {rackId: item.rackId});
        let count = _.find(counts, {rackId: item.rackId});
        if (!rack) {
            rack = {
                rackId: item.rackId,
                rackName: item.rackName,
                model: item.model,
                uNumber: item.uNumber,
                SNMP: item.SNMP,
                maxPower: item.maxPower,
                maxWeight: item.maxWeight,
                wattage: item.wattage,
                width: item.dRackWidth,
                height: item.dRackHeight,
                x: item.x,
                y: item.y,
                description: item.description,
                createdDate: item.createdDate,
                createdBy: item.createdBy,
                updatedDate: item.updatedDate,
                updatedBy: item.updatedBy,
                rackWidth: item.rackWidth,
                rackHeight: item.rackHeight,
                rackDepth: item.rackDepth,
                rack_devices: [],
                // rack_bookings: [],
                sums: []

            };
            racks.push(rack);
        }

        let rack_devices = rack.rack_devices;
        // let rack_bookings = rack.rack_bookings;
        let sums = rack.sums;
        if (item.rackId) {
            sums.push(count);
            let rack_detail = {
                deviceId: item.deviceId,
                label: item.label,
                deviceTemplateId: item.deviceTemplateId,
                contactId: item.contractId,
                IP: item.IP,
                height: item.heightRack,
                typeServer: item.typeServer,
                deviceTemplateName: item.deviceTemplateName,
                CPUDevice: item.CPU,
                RAMDevice: item.RAM,
                diskDevice: item.disk,
                maxPowerDevice: item.dtMaxPower,
                weightDevice: item.dtWeight,
                heightDevice: item.dtHeight,
                manufacturerDevice: item.manufacturer,
                frontDevice: item.front,
                rearDevice: item.rear,
                powerModuleDevice: item.powerModule,
                HDDDevice: item.HDD,
                nameContract: item.contractName,
                fullNameContract: item.fullName,
                companyContract: item.company,
                phoneContract: item.phone,
                bookingUId: item.bookingUId,
                rackId: item.rackIdBooking,
                heightBook: item.heightRackBooking
            };
            rack_devices.push(rack_detail);
            // let rack_booking = {
            //     bookingUId: item.bookingUId,
            //     rackId: item.rackIdBooking,
            //     height: item.heightRackBooking
            // }
            // rack_bookings.push(rack_booking);
        }
    });
    return result;
}


module.exports = {
    getAllRack,
    getRacks,
    insertRack,
    updateRack,
    deleteRack,
    getRackById,
    getRackByZone,
    getRackByZones,
    getRackByRoom,
    bookingU,
    addDeviceRack,
    deleteDeviceRack,
    deleteBooking,
    saveMoveU,
    getDeviceById,
    importDeviceToRack,
    updateDraw,
};