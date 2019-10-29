'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const base = require('../../base-controller');

function getAllZone(req, res) {
    let result = [];
    try {
        mysql.query(`select z.zoneId, zoneName, zg.zoneGroupId, zg.x, zg.y, zg.width, zg.height,
            z.createdDate, z.updatedDate, z.roomId, locationName, image, roomName, dataCenterName,
            dc.dataCenterId, l.locationId
            from tbl_Zones as z
            join tbl_Rooms as r on r.roomId=z.roomId
            join tbl_DataCenters as dc on r.dataCenterId=dc.dataCenterId
            join tbl_Locations as l on dc.locationId=l.locationId
            join tbl_Zones_Groups as zg on z.zoneId=zg.zoneId`, null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = formatZoneGroup(resp);
            }
            result = {
                status: 200,
                message: 'Get all zone successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllZones_zones-controller', { error: err, data: {} });
        elk.error({
            controller: 'zones-controller',
            function: 'getAllZones',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all zone failed',
            data: []
        };
        res.json(result);
    }
}

async function getZones(req, res) {
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
                    const str = search.zoneName;
                    const locationId = search.locationId;
                    const dataCenterId = search.dataCenterId;
                    const roomId = search.roomId;

                    if (str) {
                        _where.push(`zoneName like ?`);
                        dataWhere.push(`%${str}%`);
                    }
                    if (locationId) {
                        _where.push(`dc.locationId=?`);
                        dataWhere.push(locationId);
                    }
                    if (dataCenterId) {
                        _where.push(`dc.dataCenterId=?`);
                        dataWhere.push(dataCenterId);
                    }
                    if (roomId) {
                        _where.push(`r.roomId=?`);
                        dataWhere.push(roomId);
                    }
                }

                const where = _.size(_where) > 0 ? ` where ${_where.join(' and ')}` : '';
                let count = await mysql.query_transaction(connection, `select count(*) as count 
                from tbl_Zones as z
                join tbl_Rooms as r on r.roomId=z.roomId
                join tbl_DataCenters as dc on r.dataCenterId=dc.dataCenterId
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
                        message: "Get zones successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const zones = await mysql.query_transaction(connection, `select z.zoneId, zoneName,
                        z.createdDate, z.updatedDate, z.roomId, locationName, image, roomName, dataCenterName,
                        dc.dataCenterId, l.locationId
                        from tbl_Zones as z
                        join tbl_Rooms as r on r.roomId=z.roomId
                        join tbl_DataCenters as dc on r.dataCenterId=dc.dataCenterId
                        join tbl_Locations as l on dc.locationId=l.locationId
                        ${where}
                        order by z.createdDate desc
                        limit ?, ?`, [...dataWhere, from, pagination.sizePage]);
                    const ids = _.map(zones, z => z.zoneId);
                    const zoneGroup = await mysql.query_transaction(connection, 'select * from tbl_Zones_Groups where zoneId in (?)', [ids]);
                    result = {
                        status: 200,
                        data: formatZoneGroup(zones, zoneGroup),
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Zones successful!"
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
                controller: 'zones-controller',
                function: 'getZones',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get zones failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'zones-controller',
            function: 'getZones',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getZones failed!",
            data: [],
        };
        res.json(result);
    }
}

function getZoneById(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select z.zoneId, zoneName, zg.zoneGroupId, zg.x, zg.y, zg.width, zg.height,
            z.createdDate, z.updatedDate, z.roomId, locationName, image, roomName, dataCenterName,
            dc.dataCenterId, l.locationId
            from tbl_Zones as z
            join tbl_Rooms as r on r.roomId=z.roomId
            join tbl_DataCenters as dc on r.dataCenterId=dc.dataCenterId
            join tbl_Locations as l on dc.locationId=l.locationId
            join tbl_Zones_Groups as zg on z.zoneId=zg.zoneId
            where z.zoneId=?`, query.zoneId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Zones failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Zones successful!",
                    data: formatZoneGroup(resp)
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'zones-controller',
            function: 'getZoneById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get Zones failed!",
            data: []
        };
        res.json(result);
    }
}

async function insertZone(req, res) {
    const body = req.body;
    let result = {};
    const user = await base.getSession(req);
    try {
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();

                const createdDate = new Date();
                const valid = validate(body);
                if (_.size(valid) > 0) {
                    res.json(result = {
                        status: 500,
                        message: valid.join('<br>') || "Add Zone failed!"
                    });
                    elk.error({
                        controller: 'zones-controller',
                        function: 'insertZone',
                        error: {
                            message: "Validate failed"
                        },
                        data: {
                            user,
                            body,
                            validate: valid
                        }
                    });
                    return false;
                }
                const query = `insert into tbl_Zones (zoneName, roomId, createdDate) values ?`;
                const insertZone = await mysql.query_transaction(connection, query, [[[body.zoneName, body.roomId, createdDate]]]);

                if (insertZone && insertZone.affectedRows === 1) {
                    const zoneId = insertZone.insertId;
                    const query1 = `insert into tbl_Zones_Groups (zoneId, x, y, width, height, createdDate) values ?`;
                    const data = _.map(body.shapes, item => {
                        return [zoneId, item.x, item.y, item.width, item.height, createdDate]
                    });
                    const insertZoneGroup = await mysql.query_transaction(connection, query1, [data]);
                    if (insertZoneGroup && insertZoneGroup.affectedRows > 0) {
                        result = {
                            status: 200,
                            message: "Add zones successful",
                            data: {
                                zoneId: zoneId
                            }
                        };
                    } else {
                        connection.rollback();
                        result = {
                            status: 500,
                            message: "Add zones failed"
                        };
                        return res.json(result);
                    }
                }

                // end transaction
                await connection.commit();
                connection.release();
                res.json(result);
            }
        } catch (error) {
            connection.rollback();
            elk.error({
                controller: 'zones-controller',
                function: 'insertZone',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {
                    body,
                    user
                },
            });
            result = {
                status: 500,
                message: "Add zones failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'zones-controller',
            function: 'insertZone',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                body, user
            }
        });
        result = {
            status: 500,
            message: "Add Zone failed!"
        };
        res.json(result);
    }
}

async function updateZone(req, res) {
    const body = req.body;
    let result = {};
    try {
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();

                const updatedDate = new Date();
                const valid = validate(body);
                if (_.size(valid) > 0) {
                    res.json(result = {
                        status: 500,
                        message: valid.join('<br>') || "Update Zone failed!"
                    });
                    elk.error({
                        controller: 'zones-controller',
                        function: 'insertZone',
                        error: {
                            message: "Validate failed"
                        },
                        data: {
                            user,
                            body,
                            validate: valid
                        }
                    });
                    return false;
                }
                // delete zoneGroup by zoneId
                const queryDel = `delete from tbl_Zones_Groups where zoneId=?`;
                await mysql.query_transaction(connection, queryDel, [body.zoneId]);

                const queryUpdate = `update tbl_Zones set ? where zoneId=?`;
                const dataUpdate = {
                    zoneName: body.zoneName,
                    roomId: body.roomId,
                    updatedDate
                };

                // update zone
                await mysql.query_transaction(connection, queryUpdate, [dataUpdate, body.zoneId]);

                // insert zoneGroup
                const query1 = `insert into tbl_Zones_Groups (zoneId, x, y, width, height, createdDate) values ?`;
                const data = _.map(body.shapes, item => {
                    return [body.zoneId, item.x, item.y, item.width, item.height, updatedDate]
                });
                const insertZoneGroup = await mysql.query_transaction(connection, query1, [data]);
                if (insertZoneGroup && insertZoneGroup.affectedRows > 0) {
                    result = {
                        status: 200,
                        message: "Update zones successful"
                    };
                } else {
                    connection.rollback();
                    result = {
                        status: 500,
                        message: "Update zones failed"
                    };
                    return res.json(result);
                }

                // end transaction
                await connection.commit();
                connection.release();
                res.json(result);
            }
        } catch (error) {
            connection.rollback();
            elk.error({
                controller: 'zones-controller',
                function: 'updateZone',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {
                    body,
                    user
                },
            });
            result = {
                status: 500,
                message: "Update zones failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'zones-controller',
            function: 'updateZone',
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
            message: "Update failed!"
        };
        res.json(result);
    }
}

async function deleteZone(req, res) {
    const query = req.query;
    let result = {};
    try {
        const zoneId = query.id;
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();

                // delete zoneGroup by zoneId
                const queryDel = `delete from tbl_Zones_Groups where zoneId=?`;
                await mysql.query_transaction(connection, queryDel, [zoneId]);

                // delete zone
                const queryDelZone = `delete from tbl_Zones where zoneId=?`;
                await mysql.query_transaction(connection, queryDelZone, [zoneId]);

                result = {
                    status: 200,
                    message: "Delete zones successful"
                };

                // end transaction
                await connection.commit();
                connection.release();
                res.json(result);
            }
        } catch (error) {
            connection.rollback();
            elk.error({
                controller: 'zones-controller',
                function: 'deleteZone',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: {
                    query,
                    user
                },
            });
            result = {
                status: 500,
                message: "Delete zones failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'zones-controller',
            function: 'deleteZone',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Delete failed!"
        };
        res.json(result);
    }
}

function validate(data) {
    let result = [];
    if (!data.zoneName) {
        result.push('Zone name is required');
    }

    if (_.size(data.shapes) < 1) {
        result.push("You haven't drawn the zone");
    }

    if (!data.roomId) {
        result.push('RoomId is required');
    }

    return result;
}

function formatZoneGroup(zones, zoneGroup) {
    let result = [];
    _.forEach(zones, item => {
        // check zone exist
        // let find = _.find(result, {zoneId: item.zoneId});
        let children = [];

        _.forEach(zoneGroup, zg => {
            if (zg.zoneId === item.zoneId) {
                children.push({
                    zoneId: zg.zoneId,
                    zoneGroupId: zg.zoneGroupId,
                    x: zg.x,
                    y: zg.y,
                    width: zg.width,
                    height: zg.height,
                });
            }
        })

        result.push({
            ...item,
            zoneGroup: children
        });
        // if(!find) {
        //     find = {...item, zoneGroup: [child]};
        //     delete find.x;
        //     delete find.y;
        //     delete find.width;
        //     delete find.height;
        //     result.push(find);
        // }

        // push child to zoneGroup
        // if(_.findIndex(zoneGroup, {zoneGroupId: item.zoneGroupId}) === -1) zoneGroup.push(child);

        //
    });

    return result;
}

module.exports = {
    getAllZone,
    getZones,
    insertZone,
    updateZone,
    deleteZone,
    getZoneById
};