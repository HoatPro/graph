'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const base = require('../../base-controller');

function getAllDeviceInRack(req, res) {
    let result = [];
    try {
        mysql.query(`SELECT r.rackId, rackName, uNumber, r.maxPower, r.maxWeight, r.roomId, rm.roomName, zoneId, position, positionU, rd.height,
            deviceName, rd.deviceTypeId, dt.deviceTypeName, rd.deviceTemplateId, dtp.deviceTemplateName, r.zoneId, z.zoneName,
            FROM tbl_Racks as r
            join tbl_Rooms as rm on r.roomId=rm.roomId
            left join tbl_Zones as z on r.zoneId=z.zoneId
            left join tbl_Racks_Devices as rd on r.rackId=rd.rackId
            left join tbl_DeviceTypes as dt on rd.deviceTypeId=dt.deviceTypeId
            left join tbl_DeviceTemplates as dtp on rd.deviceTemplateId=dtp.deviceTemplateId
            order by deviceName`, null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all Device in rack successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllDeviceTypes_device-types-controller', { error: err, data: {} });
        elk.error({
            controller: 'device-in-rack-controller',
            function: 'getAllDeviceInRack',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all Device in rack failed',
            data: []
        };
        res.json(result);
    }
}

async function getDeviceInRack(req, res) {
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
                let _where = [];
                let dataWhere = [];
                if (_.size(search) > 0) {
                    const str = search.deviceName;
                    const roomId = search.roomId;
                    const zoneId = search.zoneId;
                    const rackId = search.rackId;
                    const deviceTemplateId = search.deviceTemplateId

                    if (str) {
                        _where.push(`rd.deviceName like ?`);
                        dataWhere.push(`%${str}%`);
                    }
                    if (roomId) {
                        _where.push(`rm.roomId=?`);
                        dataWhere.push(roomId);
                    }
                    if (zoneId) {
                        _where.push(`z.zoneId=?`);
                        dataWhere.push(zoneId);
                    }
                    if (rackId) {
                        _where.push(`r.rackId=?`);
                        dataWhere.push(rackId);
                    }
                    if (deviceTemplateId) {
                        _where.push(`dtp.deviceTemplateId=?`);
                        dataWhere.push(deviceTemplateId)
                    }
                }

                const where = _.size(_where) > 0 ? ` where ${_where.join(' and ')}` : '';
                let count = await mysql.query_transaction(connection, `select count(*) as count 
                        from tbl_Racks_Devices as rd
                        join tbl_Racks as r on rd.rackId=r.rackId
                        join tbl_Rooms as rm on r.roomId=rm.roomId
                        left join tbl_Zones as z on r.zoneId=z.zoneId
                        left join tbl_DeviceTypes as dt on rd.deviceTypeId=dt.deviceTypeId
                        left join tbl_DeviceTemplates as dtp on rd.deviceTemplateId=dtp.deviceTemplateId
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
                        message: "Get Device in Rack successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const deviceTypes = await mysql.query_transaction(connection, `select r.rackId, r.rackName, uNumber, r.maxPower, 
                        r.maxWeight, rm.roomId, rm.roomName, position, positionU, rd.height, rd.deviceId, r.zoneId, z.zoneName,
                        deviceName, rd.deviceTypeId, dt.deviceTypeName, rd.deviceTemplateId, dtp.deviceTemplateName,rd.createdBy,rd.createdDate
                        from tbl_Racks_Devices as rd
                        join tbl_Racks as r on rd.rackId=r.rackId
                        join tbl_Rooms as rm on r.roomId=rm.roomId
                        left join tbl_Zones as z on r.zoneId=z.zoneId
                        left join tbl_DeviceTypes as dt on rd.deviceTypeId=dt.deviceTypeId
                        left join tbl_DeviceTemplates as dtp on rd.deviceTemplateId=dtp.deviceTemplateId
                        ${where}
                        order by rd.createdDate desc
                        limit ?, ?`, [...dataWhere, from, pagination.sizePage]);
                    result = {
                        status: 200,
                        data: deviceTypes,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Device in Rack successful!"
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
                controller: 'device-in-rack-controller',
                function: 'getDeviceInRack',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get Device in rack failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'device-in-rack-controller',
            function: 'getDeviceInRack',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Device in rack failed!",
            data: [],
        };
        res.json(result);
    }
}

function getDeviceTypeById(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select deviceTypeId, deviceTypeName, tbl_DeviceTypes.description, tbl_DeviceTypes.createdBy,
            tbl_DeviceTypes.updatedBy, tbl_DeviceTypes.createdDate, tbl_DeviceTypes.updatedDate, fullName
            from tbl_DeviceTypes
            join tbl_Users on tbl_DeviceTypes.createdBy=tbl_Users.userId
            where deviceTypeId=?`, query.deviceTypeId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get DeviceTypes failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get DeviceTypes successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'device-types-controller',
            function: 'getDeviceTypeById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get DeviceTypes failed!",
            data: []
        };
        res.json(result);
    }
}

async function insertDeviceType(req, res) {
    const body = req.body;
    let result = {};
    const user = await base.getSession(req);
    try {
        const createdDate = new Date();
        if (!validate(body)) {
            res.json(result = {
                status: 500,
                message: "Add DeviceType failed!"
            });
            return false;
        }
        const query = `insert into tbl_DeviceTypes (deviceTypeName, description, createdDate, createdBy, status) values ?`;

        mysql.query(query, [[[body.deviceTypeName, body.description, createdDate, user.userId, 1]]], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Add DeviceType failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Add DeviceType successful!",
                    data: {
                        deviceTypeId: resp.insertId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'device-types-controller',
            function: 'insertDeviceType',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add DeviceType failed!"
        };
        res.json(result);
    }
}

async function updateDeviceType(req, res) {
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
            deviceTypeName: body.deviceTypeName,
            description: body.description,
            updatedDate: new Date(),
            updatedBy: user.userId
        };
        const query = `update tbl_DeviceTypes set ? where deviceTypeId=?`;
        mysql.query(query, [data, body.deviceTypeId], resp => {
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
                        deviceTypeId: body.deviceTypeId
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'device-types-controller',
            function: 'updateDeviceType',
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

function deleteDeviceType(req, res) {
    const query = req.query;
    let result = {};
    try {
        mysql.query(`delete from tbl_DeviceTypes where deviceTypeId=?`, parseInt(query.id), resp => {
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
            controller: 'device-types-controller',
            function: 'deleteDeviceType',
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
    if (!data.deviceTypeName) {
        return false;
    }

    return true;
}

async function importDeviceType(req, res) {
    const body = req.body;
    let result = {};
    const user = await base.getSession(req);
    try {
        const createdDate = new Date();
        // const
        let data = [];
        let dataInsert = [];
        let promises = [];
        const deviceTypes = body.deviceTypes;
        const length = deviceTypes.length;
        const status = 1;
        let error = [];
        const query = `insert into tbl_DeviceTypes (deviceTypeName, description, createdDate, createdBy, status) values ?;`;

        for (let i = 0; i < length; i++) {
            const item = deviceTypes[i];
            const name = item.name.trim();
            const desc = item.desc.trim();
            if (name && _.findIndex(data, {name: name}) === -1) {
                data.push({
                    name,
                    description: desc,
                    createdDate,
                    createdBy: user.userId,
                    status
                });
                const temp = [name, desc, createdDate, user.userId, status];

                dataInsert.push(temp);
                // const promise = new Promise(resolve => {
                //     mysql.query(query, [[temp]], resp => {
                //         if(_.isNull(resp) || resp.affectedRows === 0) {
                //             error.push(i + 2);
                //         }
                //         resolve(true);
                //     })
                // });
                //
                // promises.push(promise);
            } else {
                error.push(i + 2);
            }
        }
        mysql.query(query, [dataInsert], resp => {
            if (resp && resp.affectedRows > 0) {
                if (_.size(error) > 0) {
                    result = {
                        status: 500,
                        message: `Error in rows: ${error.join(', ')}`
                    };
                } else {
                    result = {
                        status: 200,
                        message: 'Import Device type successful!'
                    };
                }
            } else {
                result = {
                    status: 500,
                    message: 'Import Device type failed!'
                };
            }


            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'device-types-controller',
            function: 'insertDeviceType',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Import DeviceType failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllDeviceInRack,
    getDeviceInRack,
    insertDeviceType,
    updateDeviceType,
    deleteDeviceType,
    getDeviceTypeById,
    importDeviceType,
};