'use strict';
const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const base = require('../../base-controller');
const pathRooms = '../../../storage/uploads/rooms/';
const moment = require('moment');
const path = require('path');
const fs = require('fs');

function getAllRoom(req, res) {
    let result = [];
    try {
        mysql.query('select * from tbl_Rooms order by roomName', null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all room successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllRooms_rooms-controller', { error: err, data: {} });
        elk.error({
            controller: 'rooms-controller',
            function: 'getAllRooms',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all room failed',
            data: []
        };
        res.json(result);
    }
}

async function getRooms(req, res) {
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
                    const str = search.room_code;
                    const locationId = search.locationId;
                    const dataCenterId = search.dataCenterId;

                    if (str) {
                        _where.push(`(roomName like ? or codeRoom like ?)`);
                        dataWhere.push(`%${str}%`);
                        dataWhere.push(`%${str}%`);
                    }
                    if (locationId) {
                        _where.push(`tbl_DataCenters.locationId=?`);
                        dataWhere.push(locationId);
                    }
                    if (dataCenterId) {
                        _where.push(`tbl_DataCenters.dataCenterId=?`);
                        dataWhere.push(dataCenterId);
                    }
                }

                const where = _.size(_where) > 0 ? ` where ${_where.join(' and ')}` : '';
                let count = await mysql.query_transaction(connection, `select count(*) as count 
                from tbl_Rooms
                join tbl_DataCenters on tbl_DataCenters.dataCenterId=tbl_Rooms.dataCenterId
                join tbl_Locations on tbl_Locations.locationId=tbl_DataCenters.locationId
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
                        message: "Get rooms successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const rooms = await mysql.query_transaction(connection, `select roomId, roomName, totalRoom, codeRoom, width, height, capacity, image,
                        tbl_Rooms.createdDate, tbl_Rooms.updatedDate, tbl_Rooms.dataCenterId, tbl_Rooms.description, tbl_DataCenters.locationId, dataCenterName,
                        dataCenterKey, locationName
                        from tbl_Rooms 
                        join tbl_DataCenters on tbl_DataCenters.dataCenterId=tbl_Rooms.dataCenterId
                        join tbl_Locations on tbl_Locations.locationId=tbl_DataCenters.locationId
                        ${where}
                        order by tbl_Rooms.createdDate desc
                        limit ?, ?`, [...dataWhere, from, pagination.sizePage]);
                    result = {
                        status: 200,
                        data: rooms,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Rooms successful!"
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
                controller: 'rooms-controller',
                function: 'getRooms',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get Rooms failed!"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'rooms-controller',
            function: 'getRooms',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Rooms failed!",
            data: [],
        };
        res.json(result);
    }
}

function getRoomById(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select roomId, roomName, totalRoom, codeRoom, width, height, capacity, image,
            tbl_Rooms.createdDate, tbl_Rooms.updatedDate, tbl_Rooms.dataCenterId, tbl_Rooms.description, tbl_DataCenters.locationId, dataCenterName,
            dataCenterKey, locationName
            from tbl_Rooms 
            join tbl_DataCenters on tbl_DataCenters.dataCenterId=tbl_Rooms.dataCenterId
            join tbl_Locations on tbl_Locations.locationId=tbl_DataCenters.locationId
            where roomId=?`, query.roomId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get Rooms failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get Rooms successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'rooms-controller',
            function: 'getRoomById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get Rooms failed!",
            data: []
        };
        res.json(result);
    }
}

async function insertRoom(req, res) {
    const body = req.body;
    let result = {};
    let _image = '';
    let _path = '';
    try {
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();
                const createdDate = new Date();
                const files = req.files || {};
                const image = files.image || null;
                const info = JSON.parse(body.info);
                if (!validate(info)) {
                    res.json(result = {
                        status: 500,
                        message: "Add Room failed!"
                    });
                    return false;
                }
                if (image) {
                    const datetime = _var.datetime;
                    const name = image.name;
                    const regex = name.match(/.[^.]+$/)[0];
                    const prevName = name.split(regex)[0].replace(/\s/g, '-');
                    _image = `${prevName}_${moment().format(datetime.fileName)}${regex}`;
                }
                const query = `insert into tbl_Rooms (roomName, codeRoom, width, height, capacity, dataCenterId, image, description, createdDate) values ?`;
                const insert = await mysql.query_transaction(connection, query, [[[info.roomName, info.codeRoom, info.width, info.height, info.capacity, info.dataCenterId, _image, info.description, createdDate]]]);
                if (_.isNull(insert)) {
                    result = {
                        status: 500,
                        message: "Add Room failed!"
                    };
                } else {
                    const id = insert.insertId;
                    if (image) {
                        _path = path.join(__dirname, pathRooms, id.toString());
                        if (!fs.existsSync(_path)) {
                            fs.mkdirSync(_path);
                        }
                        const respImg = await insertFile(image, _path, _image);
                        if (!respImg) {
                            connection.rollback();
                            result = {
                                status: 500,
                                message: "Add Room failed!"
                            };
                            res.json(result);
                            return false;
                        }
                    }
                    result = {
                        status: 200,
                        message: "Add Room successful!",
                        data: {
                            roomId: insert.insertId
                        }
                    };
                }
            }
            // end transaction
            await connection.commit();
            connection.release();
            res.json(result);
        } catch (error) {
            connection.rollback();
            deleteFolderRecursive(_path);
            elk.error({
                controller: 'rooms-controller',
                function: 'insertRoom',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: body,
                // user: user
            });
            result = {
                status: 500,
                message: "Add Rooms failed!"
            };
            res.json(result);
        }

    } catch (error) {
        elk.error({
            controller: 'rooms-controller',
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

async function updateRoom(req, res) {
    const body = req.body;
    let result = {};
    let _image = '';
    let _path = '';
    try {
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();
                const updatedDate = new Date();
                const files = req.files || {};
                const image = files.image || null;
                let info = JSON.parse(body.info);

                if (!validate(info)) {
                    res.json(result = {
                        status: 500,
                        message: "Edit Room failed!"
                    });
                    return false;
                }
                const id = info.roomId;
                delete info.roomId;
                delete info.locationId;
                info.updatedDate = updatedDate;
                if (image) {
                    const datetime = _var.datetime;
                    const name = image.name;
                    const regex = name.match(/.[^.]+$/)[0];
                    const prevName = name.split(regex)[0].replace(/\s/g, '-');
                    _image = `${prevName}_${moment().format(datetime.fileName)}${regex}`;
                    info.image = _image;
                }
                const query = `update tbl_Rooms set ? where roomId=?`;
                const update = await mysql.query_transaction(connection, query, [info, id]);
                if (_.isNull(update)) {
                    result = {
                        status: 500,
                        message: "Edit Room failed!"
                    };
                } else {
                    if (image) {
                        _path = path.join(__dirname, pathRooms, id.toString());
                        deleteFolderRecursive(_path);
                        if (!fs.existsSync(_path)) {
                            fs.mkdirSync(_path);
                        }
                        const respImg = await insertFile(image, _path, _image);
                        if (!respImg) {
                            connection.rollback();
                            result = {
                                status: 500,
                                message: "Edit Room failed!"
                            };
                            res.json(result);
                            return false;
                        }
                    }
                    result = {
                        status: 200,
                        message: "Edit Room successful!",
                    };
                }
            }
            // end transaction
            await connection.commit();
            connection.release();
            res.json(result);
        } catch (error) {
            connection.rollback();
            deleteFolderRecursive(_path);
            elk.error({
                controller: 'rooms-controller',
                function: 'updateRoom',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: body,
                // user: user
            });
            result = {
                status: 500,
                message: "Edit Rooms failed!"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'rooms-controller',
            function: 'updateRoom',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Edit Rooms failed!"
        };
        res.json(result);
    }
}

function deleteRoom(req, res) {
    const query = req.query;
    let result = {};
    try {
        const id = query.id;
        mysql.query(`delete from tbl_Rooms where roomId=?`, parseInt(id), resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Remove Room failed!"
                };
            } else {
                let _path = path.join(__dirname, pathRooms, id.toString());
                deleteFolderRecursive(_path);
                result = {
                    status: 200,
                    message: "Remove Room successful!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'rooms-controller',
            function: 'deleteRoom',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Remove Room failed!"
        };
        res.json(result);
    }
}

function validate(data) {
    if (!data.roomName) {
        return false;
    }

    if (!data.codeRoom) {
        return false;
    }

    if (!data.width) {
        return false;
    }

    if (!data.height) {
        return false;
    }

    if (!data.capacity) {
        return false;
    }

    if (!data.dataCenterId) {
        return false;
    }

    return true;
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
        elk.error({
            controller: 'rooms-controller',
            function: 'deleteFolderRecursive',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                path: path
            }
        });
    }
}

function insertFile(file, _path, name) {
    if (file) {
        return new Promise(resolve => {
            file.mv(path.join(_path, name), function (error) {
                let result = true;
                if (error) {
                    result = false;
                    elk.error({
                        controller: 'rooms-controller',
                        function: 'insertFile',
                        error: err,
                        data: {
                            file: file,
                            path: _path,
                            name: name
                        }
                    });
                }
                resolve(result);
            });
        });
    } else {
        return false;
    }
}

module.exports = {
    getAllRoom,
    getRooms,
    insertRoom,
    updateRoom,
    deleteRoom,
    getRoomById
};