'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const moment = require('moment');
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const path = require('path');
const fs = require('fs');
const pathRooms = '../../storage/uploads/rooms/';
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllLocation(req, res) {
    const query = req.query;
    let result = {};
    let promises = [];
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const location = _var.tables.location;
        const columns = location.columns;
        const conditions = {
            table: location.name,
            order: {
                column: columns.createdDate,
                type: "ASC"
            },
        };

        const promise = new Promise(resolve => {
            mysql.count(conditions, resp => {
                resolve(resp);
            })
        });
        promises.push(promise);

        const promise1 = new Promise(resolve => {
            const temp = {
                ...conditions,
                limit: {
                    from: pagination.currentPage * pagination.sizePage,
                    size: pagination.sizePage
                }
            };
            mysql.search(temp, (resp) => {
                resolve(resp);
            });
        });
        promises.push(promise1);

        Promise.all(promises).then(resp => {
            const count = resp[0];
            const data = resp[1];
            let temp = [];
            if (!_.isNull(data)) {
                temp = data;
            }
            const countPage = ~~((count - 1) / pagination.sizePage) + 1;
            result = {
                status: 200,
                data: temp,
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get locations successful!"
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllLocation_infrastructure-controller', { error: err, data: {} });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'getAllLocation',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getAllLocation failed!"
        };
        res.json(result);
    }
}

async function insertLocation(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const tables = _var.tables;
        const location = tables.location;
        const locationColumns = location.columns;

        let conditions = {
            table: location.name,
            columns: {
                [locationColumns.name]: body.name,
                [locationColumns.desc]: body.desc,
                [locationColumns.createdDate]: createdDate,
                [locationColumns.createdBy]: body.createdBy,
            }
        };
        const insertLocation = await new Promise(resolve => {
            mysql.insert(conditions, resp => {
                resolve(resp);
            });
        });

        if (_.isNull(insertLocation.data)) {
            result = {
                status: 500,
                message: "Add Location failed!"
            };

        } else {
            result = {
                status: 200,
                message: "Add Location successful!",
            };
        }

        res.json(result);


    } catch (error) {
        // console.error('addLocation-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'insertLocation',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add Location failed!"
        };
        res.json(result);
    }
}

async function updateLocation(req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const location = tables.location;
        const locationColumns = location.columns;
        const updatedDate = new Date();

        const conditions = {
            table: location.name,
            columns: {
                [locationColumns.name]: body.name,
                [locationColumns.desc]: body.desc,
                [locationColumns.updatedDate]: updatedDate,
                [locationColumns.updatedBy]: body.updatedBy
            },
            where: {
                and: [
                    {column: `${location.name}.${locationColumns.id}`, value: body.locationId, compare: '='}
                ]
            }
        };
        const updateLocation = await new Promise(resolve => {
            mysql.update(conditions, resp => {
                resolve(resp);
            });
        });
        if (_.isNull(updateLocation.data)) {
            result = {
                status: 500,
                message: updateLocation.message ? updateLocation.message : "Update Location failed!"
            };
            res.json(result);
        } else {
            result = {
                status: 200,
                message: "Update Location successful!",
                data: {
                    ...body,
                    updatedDate: updatedDate
                }
            };
        }
        res.json(result);
    } catch (error) {
        // console.error('updateLocation_infrastructure-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'updateLocation',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update Location failed!"
        };
        res.json(result);
    }
}

function deleteLocation(req, res) {
    const body = req.query;
    let result = {};
    try {
        const table = _var.tables.location;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.locationId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete Location failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete Location successful!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        // console.error('deleteRole_Location-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'deleteLocation',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Delete Location failed!"
        };
        res.json(result);
    }
}

//----------- DATACENTER ---------------//

async function getDatacenter(req, res) {
    const query = req.query;
    let result = {};
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const datacenter = _var.tables.dataCenter;
        const columnsDatacenter = datacenter.columns;
        const location = _var.tables.location;
        const columnsLocation = location.columns;
        const conditions = {
            table: datacenter.name,
            order: {
                column: columnsDatacenter.createdDate,
                type: "ASC"
            },
        };

        const count = await new Promise(resolve => {
            mysql.count(conditions, resp => {
                resolve(resp);
            })
        });
        const countPage = ~~((count - 1) / pagination.sizePage) + 1;

        if (count === 0) {
            result = {
                status: 200,
                message: "Get Regions success!",
                datacenter: {
                    data: []
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
            }
        } else {
            const getDatacenter = await new Promise(resolve => {
                const conditions1 = {
                    ...conditions,
                    limit: {
                        from: pagination.currentPage * pagination.sizePage,
                        size: pagination.sizePage
                    }
                };
                mysql.search(conditions1, (resp) => {
                    resolve(resp);
                });
            });

            const conditions2 = {
                table: location.name,
                order: {
                    column: columnsLocation.createdDate,
                    type: "ASC"
                },
            };

            const getLocation = await new Promise(resolve => {
                mysql.search(conditions2, (resp) => {
                    resolve(resp);
                })
            });

            if (_.isNull(getDatacenter) || _.isNull((getLocation))) {
                result = {
                    status: 500,
                    message: "Get Datacenter failed!"
                };
            } else {
                const listLocation = getLocation.map((location) => {
                    return {value: location.locationId.toString(), label: location.locationName}
                });
                result = {
                    status: 200,
                    message: "Get Datacenter success!",
                    datacenter: {
                        data: getDatacenter,
                        listLocation: listLocation
                    },
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                };
            }
            res.json(result);
        }
    } catch (error) {
        // console.error('getAllDatacenter_infrastructure-controller', { error: err, data: {} });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'getDatacenter',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        res.json(result);
    }
}

async function insertDatacenter(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const tables = _var.tables;
        const datacenter = tables.dataCenter;
        const datacenterColumns = datacenter.columns;

        let conditions = {
            table: datacenter.name,
            columns: {
                [datacenterColumns.name]: body.name,
                [datacenterColumns.desc]: body.desc,
                [datacenterColumns.locationId]: body.locationId,
                [datacenterColumns.createdDate]: createdDate,
                [datacenterColumns.createdBy]: body.createdBy,
            }
        };
        const insertDatacenter = await new Promise(resolve => {
            mysql.insert(conditions, resp => {
                resolve(resp);
            });
        });

        if (_.isNull(insertDatacenter.data)) {
            result = {
                status: 500,
                message: "Add Datacenter failed!"
            };
        } else {
            result = {
                status: 200,
                message: "Add Datacenter successful!",
            };
        }
        res.json(result);
    } catch (error) {
        // console.error('addDatacenter-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'insertDatacenter',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add Datacenter failed!"
        };
        res.json(result);
    }
}

async function updateDatacenter(req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const datacenter = tables.dataCenter;
        const datacenterColumns = datacenter.columns;
        const updatedDate = new Date();

        const conditions = {
            table: datacenter.name,
            columns: {
                [datacenterColumns.name]: body.name,
                [datacenterColumns.desc]: body.desc,
                [datacenterColumns.locationId]: body.locationId,
                [datacenterColumns.updatedDate]: updatedDate,
                [datacenterColumns.updatedBy]: body.updatedBy
            },
            where: {
                and: [
                    {column: `${datacenter.name}.${datacenterColumns.id}`, value: body.dataCenterId, compare: '='}
                ]
            }
        };
        const updateDatacenter = await new Promise(resolve => {
            mysql.update(conditions, resp => {
                resolve(resp);
            });
        });
        if (_.isNull(updateDatacenter.data)) {
            result = {
                status: 500,
                message: updateDatacenter.message ? updateDatacenter.message : "Update Datacenter failed!"
            };
            res.json(result);
        } else {
            result = {
                status: 200,
                message: "Update Datacenter successful!",
                data: {
                    ...body,
                    updatedDate: updatedDate
                }
            };
        }
        res.json(result);
    } catch (error) {
        // console.error('updateDatacenter_infrastructure-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'updateDatacenter',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update Datacenter failed!"
        };
        res.json(result);
    }
}

function deleteDatacenter(req, res) {
    const body = req.query;
    let result = {};
    try {
        const table = _var.tables.dataCenter;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.dataCenterId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete Datacenter failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete Datacenter successful!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        // console.error('deleteRole_Datacenter-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'deleteDatacenter',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Delete Datacenter failed!"
        };
        res.json(result);
    }
}

//----------- ROOM ---------------//

async function getRoom(req, res) {
    const query = req.query;
    let result = [];
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const datacenter = _var.tables.dataCenter;
        const columnsDatacenter = datacenter.columns;
        const location = _var.tables.location;
        const columnsLocation = location.columns;
        const room = _var.tables.room;
        const columnsRoom = room.columns;

        const conditions = {
            table: room.name,
            order: {
                column: columnsRoom.createdDate,
                type: "ASC"
            },
        };

        const count = await new Promise(resolve => {
            mysql.count(conditions, resp => {
                resolve(resp);
            })
        });
        const countPage = ~~((count - 1) / pagination.sizePage) + 1;

        if (count === 0) {
            result = {
                status: 200,
                message: "Get Regions success!",
                room: {
                    data: [],
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
            }
        } else {
            const getRoom = await new Promise(resolve => {
                const conditions1 = {
                    ...conditions,
                    select: [
                        {
                            table: room.name,
                            columns: [
                                {name: columnsRoom.id},
                                {name: columnsRoom.name},
                                {name: columnsRoom.codeRoom},
                                {name: columnsRoom.width},
                                {name: columnsRoom.height},
                                {name: columnsRoom.capacity},
                                {name: columnsRoom.desc},
                                {name: columnsRoom.urlImageRoom},
                                {name: columnsRoom.dataCenterId},
                                {name: columnsRoom.locationId},
                                {name: columnsRoom.createdDate},
                                {name: columnsRoom.updatedDate},

                            ]
                        },
                        {
                            table: datacenter.name,
                            columns: [
                                {name: columnsDatacenter.name, as: 'dataCenterName'},
                            ]
                        }
                    ],
                    join: {
                        join: [
                            {
                                table: datacenter.name,
                                conditions: {
                                    [datacenter.name]: columnsDatacenter.id,
                                    [room.name]: columnsRoom.dataCenterId
                                }
                            }
                        ]
                    },
                    limit: {
                        from: pagination.currentPage * pagination.sizePage,
                        size: pagination.sizePage
                    },
                };
                mysql.search(conditions1, (resp) => {
                    resolve(resp);
                });
            });

            const conditions2 = {
                table: location.name,
                order: {
                    column: columnsLocation.createdDate,
                    type: "ASC"
                },
            };

            const getLocation = await new Promise(resolve => {
                mysql.search(conditions2, (resp) => {
                    resolve(resp);
                })
            });

            const conditions3 = {
                table: datacenter.name,
                order: {
                    column: columnsDatacenter.createdDate,
                    type: "ASC"
                },
            };

            const getDatacenter = await new Promise(resolve => {
                mysql.search(conditions3, (resp) => {
                    resolve(resp);
                })
            });

            if (_.isNull(getDatacenter) || _.isNull(getLocation) || _.isNull(getRoom)) {
                result = {
                    status: 500,
                    message: "Get Room failed!"
                };
            } else {
                let listLocation = getLocation.map((location) => {
                    return {value: location.locationId.toString(), label: location.locationName}
                });
                let listDatacenter = getDatacenter.map((datacenter) => {
                    return {value: datacenter.dataCenterId.toString(), label: datacenter.dataCenterName}
                });
                result = {
                    status: 200,
                    message: "Get Room success!",
                    room: {
                        data: getRoom,
                        listLocation: listLocation,
                        listDatacenter: listDatacenter,
                        datacenter: getDatacenter
                    },
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                }
            }
        }
        res.json(result);
    } catch (error) {
        // console.error('getAllROOM_infrastructure-controller', { error: err, data: {} });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'getRoom',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getRoom failed!"
        };
        res.json(result);
    }
}

async function insertRoom(req, res) {
    const body = req.body;
    let result = {};
    try {
        const info = JSON.parse(body.info);
        const files = req.files;
        const urlImageRoom = files.urlImageRoom;
        let _urlImageRoom = '';
        const createdDate = new Date();
        const tables = _var.tables;
        const room = tables.room;
        const roomColumns = room.columns;

        if (urlImageRoom) {
            const datetime = _var.datetime;
            const name = urlImageRoom.name;
            const regex = name.match(/.[^.]+$/)[0];
            const prevName = name.split(regex)[0].replace(/\s/g, '-');
            _urlImageRoom = `${prevName}_${moment().format(datetime.fileName)}${regex}`;
        }


        let conditions = {
            table: room.name,
            columns: {
                [roomColumns.name]: info.name,
                [roomColumns.codeRoom]: info.codeRoom,
                [roomColumns.desc]: info.desc,
                [roomColumns.width]: info.width,
                [roomColumns.height]: info.height,
                [roomColumns.capacity]: info.capacity,
                [roomColumns.urlImageRoom]: _urlImageRoom,
                [roomColumns.locationId]: info.locationId,
                [roomColumns.dataCenterId]: info.dataCenterId,
                [roomColumns.createdDate]: createdDate
            }
        };
        const insertRoom = await new Promise(resolve => {
            mysql.insert(conditions, resp => {
                resolve(resp);
            });
        });

        if (_.isNull(insertRoom.data)) {
            result = {
                status: 500,
                message: "Add Room failed!"
            };
        } else {
            const id = insertRoom.data.insertId;
            let _path = path.join(__dirname, pathRooms, id.toString());
            if (!fs.existsSync(_path)) {
                fs.mkdirSync(_path);
            }
            if (urlImageRoom) {
                const respImg = await insertFile(urlImageRoom, _path, _urlImageRoom);
                if (!respImg) {
                    result = {
                        status: 500,
                        message: "Add Room failed!"
                    };
                    res.json(result);
                    _deleteRoom(id);
                    deleteFolderRecursive(_path);
                    return false;
                }
            }
            result = {
                status: 200,
                message: "Add Room successful!",
            };
        }
        res.json(result);
    } catch (error) {
        // console.error('addRoom-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'insertRoom',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add Room failed!"
        };
        res.json(result);
    }
}

function deleteFolderRecursive(path) {
    try {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    } catch (error) {
        logger.error('deleteFolderRecursive_profile-controller', {errors: e, data: path});
    }
}

function _deleteRoom(id) {
    const table = _var.tables.room;
    const tableName = table.name;
    const columns = table.columns;
    const conditions = {
        table: tableName,
        where: {
            and: [
                {column: `${tableName}.${columns.id}`, value: id, compare: '='}
            ]
        }
    };

    return new Promise(resolve => {
        mysql.delete(conditions, resp => {
            resolve(resp);
        })
    });
}

function insertFile(file, _path, name) {
    if (file) {
        return new Promise(resolve => {
            // fs.writeFile(path.join(_path, name), file.data, (error) => {
            //     let result = true;
            //     if (error) {
            //         result = false;
            //         console.log('insertFile_device-templates-controller', { error: err });
            //     }
            //     resolve(result);
            // });
            file.mv(path.join(_path, name), function (error) {
                let result = true;
                if (error) {
                    result = false;
                    // console.log('insertFile_device-templates-controller', { error: err });
                    elk.error({
                        controller: 'infrastructure-controller',
                        function: 'insertFile',
                        error: err,
                        data: {}
                    });
                }
                resolve(result);
            });
        });
    } else {
        return false;
    }
}

async function updateRoom(req, res) {
    const body = req.body;
    let result = {};
    try {
        const info = JSON.parse(body.info);
        const tables = _var.tables;
        const room = tables.room;
        const roomColumns = room.columns;
        const updatedDate = new Date();
        const conditions = {
            table: room.name,
            columns: {
                [roomColumns.name]: info.name,
                [roomColumns.codeRoom]: info.codeRoom,
                [roomColumns.desc]: info.desc,
                [roomColumns.width]: info.width,
                [roomColumns.height]: info.height,
                [roomColumns.capacity]: info.capacity,
                [roomColumns.locationId]: info.locationId,
                [roomColumns.dataCenterId]: info.dataCenterId,
                [roomColumns.updatedDate]: updatedDate
            },
            where: {
                and: [
                    {column: `${room.name}.${roomColumns.id}`, value: info.roomId, compare: '='}
                ]
            }
        };

        if (!_.isNull(req.files)) {
            const files = req.files;
            const urlImageRoom = files.urlImageRoom;
            let _urlImageRoom = '';
            if (urlImageRoom) {
                const datetime = _var.datetime;
                const name = urlImageRoom.name;
                const regex = name.match(/.[^.]+$/)[0];
                const prevName = name.split(regex)[0].replace(/\s/g, '-');
                _urlImageRoom = `${prevName}_${moment().format(datetime.fileName)}${regex}`;
            }
            conditions.columns = {
                [roomColumns.name]: info.name,
                [roomColumns.codeRoom]: info.codeRoom,
                [roomColumns.desc]: info.desc,
                [roomColumns.width]: info.width,
                [roomColumns.height]: info.height,
                [roomColumns.capacity]: info.capacity,
                [roomColumns.urlImageRoom]: _urlImageRoom,
                [roomColumns.locationId]: info.locationId,
                [roomColumns.dataCenterId]: info.dataCenterId,
                [roomColumns.updatedDate]: updatedDate
            };
            const updateRoom = await new Promise(resolve => {
                mysql.update(conditions, resp => {
                    resolve(resp);
                });
            });
            if (_.isNull(updateRoom.data)) {
                result = {
                    status: 500,
                    message: updateRoom.message ? updateRoom.message : "Update Room failed!"
                };
                res.json(result);
            } else {
                const id = info.roomId;
                let _path = path.join(__dirname, pathRooms, id.toString());
                if (!fs.existsSync(_path)) {
                    fs.mkdirSync(_path);
                }
                if (urlImageRoom) {
                    const respImg = await insertFile(urlImageRoom, _path, _urlImageRoom);
                    if (!respImg) {
                        result = {
                            status: 500,
                            message: "Update Room failed!"
                        };
                        res.json(result);
                        return false;
                    }
                }
                result = {
                    status: 200,
                    message: "Update Room successful!",
                };
            }
        } else {
            const updateRoom = await new Promise(resolve => {
                mysql.update(conditions, resp => {
                    resolve(resp);
                });
            });
            if (_.isNull(updateRoom.data)) {
                result = {
                    status: 500,
                    message: updateRoom.message ? updateRoom.message : "Update Room failed!"
                };
                res.json(result);
            } else {
                result = {
                    status: 200,
                    message: "Update Room successful!",
                    data: {
                        ...body,
                        updatedDate: updatedDate
                    }
                };
            }
        }
        res.json(result);
    } catch (error) {
        // console.error('updateRoom_infrastructure-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'updateRoom',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update Room failed!"
        };
        res.json(result);
    }
}

function deleteRoom(req, res) {
    const body = req.query;
    let result = {};
    try {
        const table = _var.tables.room;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.roomId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete Room failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete Room successful!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        // console.error('deleteRoom-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'deleteRoom',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Delete Room failed!"
        };
        res.json(result);
    }
}

//----------- ZONE ---------------//

async function getZone(req, res) {
    const query = req.query;
    let result = [];
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const datacenter = _var.tables.dataCenter;
        const columnsDatacenter = datacenter.columns;
        const location = _var.tables.location;
        const columnsLocation = location.columns;
        const room = _var.tables.room;
        const columnsRoom = room.columns;
        const zone = _var.tables.zone;
        const columnsZone = zone.columns;

        const conditions = {
            table: zone.name,
            order: {
                column: columnsZone.createdDate,
                type: "ASC"
            },
        };

        const count = await new Promise(resolve => {
            mysql.count(conditions, resp => {
                resolve(resp);
            })
        });
        const countPage = ~~((count - 1) / pagination.sizePage) + 1;

        if (count === 0) {
            result = {
                status: 200,
                message: "Get Regions success!",
                zone: {
                    data: [],
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
            }
        } else {
            const getZone = await new Promise(resolve => {
                const conditions1 = {
                    ...conditions,
                    select: [
                        {
                            table: zone.name,
                            columns: [
                                {name: columnsZone.id},
                                {name: columnsZone.name},
                                {name: columnsZone.width},
                                {name: columnsZone.height},
                                {name: columnsZone.x},
                                {name: columnsZone.y},
                                {name: columnsZone.dataCenterId},
                                {name: columnsZone.locationId},
                                {name: columnsZone.roomId},
                                {name: columnsZone.createdDate},
                                {name: columnsZone.updatedDate},

                            ]
                        },
                        {
                            table: datacenter.name,
                            columns: [
                                {name: columnsDatacenter.name, as: 'dataCenterName'},
                            ]
                        },
                        {
                            table: room.name,
                            columns: [
                                {name: columnsRoom.name, as: 'roomName'},
                                {name: columnsRoom.urlImageRoom},
                            ]
                        },
                        {
                            table: location.name,
                            columns: [
                                {name: columnsLocation.name, as: 'locationName'},
                            ]
                        }
                    ],
                    join: {
                        join: [
                            {
                                table: datacenter.name,
                                conditions: {
                                    [datacenter.name]: columnsDatacenter.id,
                                    [zone.name]: columnsZone.dataCenterId
                                }
                            },
                            {
                                table: room.name,
                                conditions: {[room.name]: columnsRoom.id, [zone.name]: columnsZone.roomId}
                            },
                            {
                                table: location.name,
                                conditions: {[location.name]: columnsLocation.id, [zone.name]: columnsZone.locationId}
                            }
                        ]
                    },
                    limit: {
                        from: pagination.currentPage * pagination.sizePage,
                        size: pagination.sizePage
                    },
                };
                mysql.search(conditions1, (resp) => {
                    resolve(resp);
                })
            });

            const conditions2 = {
                table: datacenter.name,
                order: {
                    column: columnsDatacenter.createdDate,
                    type: "DESC"
                },
            };

            const getDatacenter = await new Promise(resolve => {
                mysql.search(conditions2, (resp) => {
                    resolve(resp);
                });
            });

            const conditions3 = {
                table: location.name,
                order: {
                    column: columnsLocation.createdDate,
                    type: "ASC"
                },
            };

            const getLocation = await new Promise(resolve => {
                mysql.search(conditions3, (resp) => {
                    resolve(resp);
                })
            });

            const conditions4 = {
                table: room.name,
                order: {
                    column: columnsRoom.createdDate,
                    type: "ASC"
                }
            };
            const getRoom = await new Promise(resolve => {
                mysql.search(conditions4, (resp) => {
                    resolve(resp);
                })
            });

            if (_.isNull(getDatacenter) || _.isNull(getLocation) || _.isNull(getRoom) || _.isNull(getZone)) {
                result = {
                    status: 500,
                    message: "Get Room failed!"
                };
            } else {
                let listLocation = getLocation.map((location) => {
                    return {value: location.locationId.toString(), label: location.locationName}
                });
                let listDatacenter = getDatacenter.map((datacenter) => {
                    return {value: datacenter.dataCenterId.toString(), label: datacenter.dataCenterName}
                });
                let listRoom = getRoom.map((room) => {
                    return {value: room.roomId.toString(), label: room.roomName}
                });
                result = {
                    status: 200,
                    message: "Get Room success!",
                    zone: {
                        data: getZone,
                        listLocation: listLocation,
                        listDatacenter: listDatacenter,
                        listRoom: listRoom,
                        datacenter: getDatacenter,
                        room: getRoom
                    },
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                }
            }
        }
        res.json(result);
    } catch (error) {
        // console.error('getAllZONE_infrastructure-controller', { error: err, data: {} });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'getZone',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getZone failed!"
        };
        res.json(result);
    }
}

async function insertZone(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const tables = _var.tables;
        const zone = tables.zone;
        const zoneColumns = zone.columns;

        let conditions = {
            table: zone.name,
            columns: {
                [zoneColumns.name]: body.name,
                [zoneColumns.width]: body.width,
                [zoneColumns.height]: body.height,
                [zoneColumns.x]: body.x,
                [zoneColumns.y]: body.y,
                [zoneColumns.locationId]: body.locationId,
                [zoneColumns.dataCenterId]: body.dataCenterId,
                [zoneColumns.roomId]: body.roomId,
                [zoneColumns.createdDate]: createdDate,
            }
        };
        const insertZone = await new Promise(resolve => {
            mysql.insert(conditions, resp => {
                resolve(resp);
            });
        });

        if (_.isNull(insertZone.data)) {
            result = {
                status: 500,
                message: "Add Zone failed!"
            };
        } else {
            result = {
                status: 200,
                message: "Add Zone successful!",
            };
        }
        res.json(result);
    } catch (error) {
        // console.error('addZone-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'insertZone',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
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
        const tables = _var.tables;
        const zone = tables.zone;
        const zoneColumns = zone.columns;
        const updatedDate = new Date();

        const conditions = {
            table: zone.name,
            columns: {
                [zoneColumns.name]: body.name,
                [zoneColumns.width]: body.width,
                [zoneColumns.height]: body.height,
                [zoneColumns.x]: body.x,
                [zoneColumns.y]: body.y,
                [zoneColumns.locationId]: body.locationId,
                [zoneColumns.dataCenterId]: body.dataCenterId,
                [zoneColumns.roomId]: body.roomId,
                [zoneColumns.updatedDate]: updatedDate,
            },
            where: {
                and: [
                    {column: `${zone.name}.${zoneColumns.id}`, value: body.zoneId, compare: '='}
                ]
            }
        };
        const updateZone = await new Promise(resolve => {
            mysql.update(conditions, resp => {
                resolve(resp);
            });
        });
        if (_.isNull(updateZone.data)) {
            result = {
                status: 500,
                message: updateZone.message ? updateZone.message : "Update Zone failed!"
            };
            res.json(result);
        } else {
            result = {
                status: 200,
                message: "Update Zone successful!",
                data: {
                    ...body,
                    updatedDate: updatedDate
                }
            };
        }
        res.json(result);
    } catch (error) {
        // console.error('updateZone_infrastructure-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'updateZone',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update Zone failed!"
        };
        res.json(result);
    }
}

function deleteZone(req, res) {
    const body = req.query;
    let result = {};
    try {
        const table = _var.tables.zone;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.zoneId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete Room failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete Room successful!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        // console.error('deleteRoom-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'deleteZone',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Delete Room failed!"
        };
        res.json(result);
    }
}

//----------- CUSTOMER ---------------//

function getCustomer(req, res) {
    const query = req.query;
    let result = {};
    let promises = [];
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const customer = _var.tables.customer;
        const columns = customer.columns;
        const conditions = {
            table: customer.name,
            order: {
                column: columns.createdDate,
                type: "ASC"
            },
        };

        const promise = new Promise(resolve => {
            mysql.count(conditions, resp => {
                resolve(resp);
            })
        });
        promises.push(promise);

        const promise1 = new Promise(resolve => {
            const temp = {
                ...conditions,
                limit: {
                    from: pagination.currentPage * pagination.sizePage,
                    size: pagination.sizePage
                }
            };
            mysql.search(temp, (resp) => {
                resolve(resp);
            });
        });
        promises.push(promise1);

        Promise.all(promises).then(resp => {
            const count = resp[0];
            const data = resp[1];
            let temp = [];
            if (!_.isNull(data)) {
                temp = data;
            }
            const countPage = ~~((count - 1) / pagination.sizePage) + 1;
            result = {
                status: 200,
                data: temp,
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get customers successful!"
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getCustomer_infrastructure-controller', { error: err, data: {} });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'getCustomer',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getCustomer failed!"
        };
        res.json(result);
    }
}

async function insertCustomer(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const tables = _var.tables;
        const customer = tables.customer;
        const customerColumns = customer.columns;

        let conditions = {
            table: customer.name,
            columns: {
                [customerColumns.name]: body.name,
                [customerColumns.desc]: body.desc,
                [customerColumns.createdDate]: createdDate,
                [customerColumns.createdBy]: body.createdBy,
            }
        };
        const insertCustomer = await new Promise(resolve => {
            mysql.insert(conditions, resp => {
                resolve(resp);
            });
        });

        if (_.isNull(insertCustomer.data)) {
            result = {
                status: 500,
                message: "Add Customer failed!"
            };

        } else {
            result = {
                status: 200,
                message: "Add Customer successful!",
            };
        }
        res.json(result);
    } catch (error) {
        // console.error('addCustomer-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
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
        const tables = _var.tables;
        const customer = tables.customer;
        const customerColumns = customer.columns;
        const updatedDate = new Date();

        const conditions = {
            table: customer.name,
            columns: {
                [customerColumns.name]: body.name,
                [customerColumns.desc]: body.desc,
                [customerColumns.updatedDate]: updatedDate,
                [customerColumns.updatedBy]: body.updatedBy
            },
            where: {
                and: [
                    {column: `${customer.name}.${customerColumns.id}`, value: body.customerId, compare: '='}
                ]
            }
        };
        const updateCustomer = await new Promise(resolve => {
            mysql.update(conditions, resp => {
                resolve(resp);
            });
        });
        if (_.isNull(updateCustomer.data)) {
            result = {
                status: 500,
                message: updateCustomer.message ? updateCustomer.message : "Update Customer failed!"
            };
            res.json(result);
        } else {
            result = {
                status: 200,
                message: "Update Customer successful!",
                data: {
                    ...body,
                    updatedDate: updatedDate
                }
            };
        }
        res.json(result);
    } catch (error) {
        // console.error('updateCustomer_infrastructure-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'updateCustomer',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update Customer failed!"
        };
        res.json(result);
    }
}

function deleteCustomer(req, res) {
    const body = req.query;
    let result = {};
    try {
        const table = _var.tables.customer;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.customerId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete Customer failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete Customer successful!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        // console.error('deleteRole_Customer-controller', { error: e, data: body });
        elk.error({
            controller: 'infrastructure-controller',
            function: 'deleteCustomer',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Delete Customer failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllLocation,
    insertLocation,
    deleteLocation,
    updateLocation,
    getDatacenter,
    insertDatacenter,
    deleteDatacenter,
    updateDatacenter,
    getRoom,
    insertRoom,
    deleteRoom,
    updateRoom,
    getZone,
    insertZone,
    updateZone,
    deleteZone,
    getCustomer,
    insertCustomer,
    updateCustomer,
    deleteCustomer,
};