'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const base = require('../../base-controller');
const pathDeviceTemplates = '../../../storage/uploads/deviceTemplates/';
const moment = require('moment');
const path = require('path');
const fs = require('fs');

function getAllDeviceTemplate(req, res) {
    let result = [];
    try {
        mysql.query('select * from tbl_DeviceTemplates order by deviceTemplateName', null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                message: 'Get all deviceTemplate successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllDeviceTemplates_deviceTemplates-controller', { error: err, data: {} });
        elk.error({
            controller: 'deviceTemplates-controller',
            function: 'getAllDeviceTemplates',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        result = {
            status: 500,
            message: 'Get all deviceTemplate failed',
            data: []
        };
        res.json(result);
    }
}

async function getDeviceTemplates(req, res) {
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

                // search
                const str = search.str || '';
                const deviceTypeId = search.deviceTypeId || '';
                let dataW = [], where = [];
                if (str) {
                    where.push('tbl_DeviceTemplates.deviceTemplateName like ?');
                    dataW.push(`%${str}%`);
                }
                if (deviceTypeId) {
                    where.push('tbl_DeviceTemplates.deviceTypeId=?');
                    dataW.push(deviceTypeId);
                }
                const strCount = `select count(*) as count from tbl_DeviceTemplates ${_.size(where) > 0 ? 'where ' + where.join(' and ') : ''}`;
                let count = await mysql.query_transaction(connection, strCount, dataW);
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
                        message: "Get deviceTemplates successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const deviceTemplates = await mysql.query_transaction(connection, `select deviceTemplateId, deviceTemplateName, tbl_DeviceTypes.deviceTypeId, tbl_DeviceTypes.deviceTypeName,
                        CPU, RAM, disk, weight, height, maxPower, powerModule, front, rear, tbl_DeviceTemplates.createdDate, tbl_DeviceTemplates.updatedDate, tbl_DeviceTemplates.description,
                        manufacturer
                        from tbl_DeviceTemplates 
                        join tbl_DeviceTypes on tbl_DeviceTypes.deviceTypeId=tbl_DeviceTemplates.deviceTypeId
                        ${_.size(where) > 0 ? 'where ' + where.join(' and ') : ''}
                        order by tbl_DeviceTemplates.createdDate desc
                        limit ?, ?`, [...dataW, from, pagination.sizePage]);
                    result = {
                        status: 200,
                        data: deviceTemplates,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get DeviceTemplates successful!"
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
                controller: 'deviceTemplates-controller',
                function: 'getDeviceTemplates',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get DeviceTemplates failed!"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'deviceTemplates-controller',
            function: 'getDeviceTemplates',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get DeviceTemplates failed!",
            data: [],
        };
        res.json(result);
    }
}

function getDeviceTemplateById(req, res) {
    let result = {};
    const query = req.query;
    try {
        mysql.query(`select deviceTemplateId, deviceTemplateName, tbl_DeviceTypes.deviceTypeId, tbl_DeviceTypes.deviceTypeName, manufacturer,
            CPU, RAM, disk, weight, height, maxPower, powerModule, front, rear, tbl_DeviceTemplates.createdDate, tbl_DeviceTemplates.updatedDate, tbl_DeviceTemplates.description
            from tbl_DeviceTemplates 
            join tbl_DeviceTypes on tbl_DeviceTypes.deviceTypeId=tbl_DeviceTemplates.deviceTypeId
            where deviceTemplateId=?`, query.deviceTemplateId, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Get DeviceTemplates failed!",
                    data: []
                };
            } else {
                result = {
                    status: 200,
                    message: "Get DeviceTemplates successful!",
                    data: resp
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'deviceTemplates-controller',
            function: 'getDeviceTemplateById',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get DeviceTemplates failed!",
            data: []
        };
        res.json(result);
    }
}

async function insertDeviceTemplate(req, res) {
    const body = req.body;
    let result = {};
    const user = await base.getSession(req);
    let _front = '';
    let _rear = '';
    let _path = '';
    let _path1 = '';
    try {
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();
                const createdDate = new Date();
                const files = req.files || {};
                const front = files.front || null;
                const rear = files.rear || null;
                const info = JSON.parse(body.info);
                if (!validate(info)) {
                    res.json(result = {
                        status: 500,
                        message: "Add DeviceTemplate failed!"
                    });
                    return false;
                }
                if (front) {
                    const datetime = _var.datetime;
                    const name = front.name;
                    const regex = name.match(/.[^.]+$/)[0];
                    const prevName = name.split(regex)[0].replace(/\s/g, '-');
                    _front = `${prevName}_${moment().format(datetime.fileName)}${regex}`;
                }

                if (rear) {
                    const datetime = _var.datetime;
                    const name = rear.name;
                    const regex = name.match(/.[^.]+$/)[0];
                    const prevName = name.split(regex)[0].replace(/\s/g, '-');
                    _rear = `${prevName}_${moment().format(datetime.fileName)}${regex}`;
                }

                const query = `insert into tbl_DeviceTemplates (deviceTemplateName, deviceTypeId, CPU, RAM, disk, maxPower, powerModule, weight, height, manufacturer, front, rear, description, createdDate, createdBy, status) values ?`;
                const insert = await mysql.query_transaction(connection, query,
                    [[[info.deviceTemplateName, info.deviceTypeId, info.CPU, info.RAM, info.disk, info.maxPower, info.powerModule, info.weight, info.height, info.manufacturer, _front, _rear, info.description, createdDate, user.userId, 1]]]);
                if (_.isNull(insert)) {
                    result = {
                        status: 500,
                        message: "Add Device Template failed!"
                    };
                } else {
                    const id = insert.insertId;
                    if (front) {
                        _path = path.join(__dirname, pathDeviceTemplates, id.toString());
                        if (!fs.existsSync(_path)) {
                            fs.mkdirSync(_path);
                        }
                        _path1 = path.join(_path, 'front');
                        if (!fs.existsSync(_path1)) {
                            fs.mkdirSync(_path1);
                        }
                        const respImg = await insertFile(front, _path1, _front);
                        if (!respImg) {
                            connection.rollback();
                            result = {
                                status: 500,
                                message: "Add DeviceTemplate failed!"
                            };
                            res.json(result);
                            return false;
                        }
                    }
                    if (rear) {
                        _path = path.join(__dirname, pathDeviceTemplates, id.toString());
                        if (!fs.existsSync(_path)) {
                            fs.mkdirSync(_path);
                        }
                        _path1 = path.join(_path, 'rear');
                        if (!fs.existsSync(_path1)) {
                            fs.mkdirSync(_path1);
                        }
                        const respImg = await insertFile(rear, _path1, _rear);
                        if (!respImg) {
                            connection.rollback();
                            result = {
                                status: 500,
                                message: "Add DeviceTemplate failed!"
                            };
                            res.json(result);
                            return false;
                        }
                    }
                    result = {
                        status: 200,
                        message: "Add Device Template successful!",
                        data: {
                            deviceTemplateId: insert.insertId
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
                controller: 'deviceTemplates-controller',
                function: 'insertDeviceTemplate',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: body,
                // user: user
            });
            result = {
                status: 500,
                message: "Add DeviceTemplates failed!"
            };
            res.json(result);
        }

    } catch (error) {
        elk.error({
            controller: 'deviceTemplates-controller',
            function: 'insertDeviceTemplate',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add DeviceTemplate failed!"
        };
        res.json(result);
    }
}

async function updateDeviceTemplate(req, res) {
    const body = req.body;
    let result = {};
    let _front = '';
    let _rear = '';
    let _path = '';
    let _path1 = '';
    try {
        const connection = await mysql.transaction();
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();
                const updatedDate = new Date();
                const files = req.files || {};
                const front = files.front || null;
                const rear = files.rear || null;
                let info = JSON.parse(body.info);

                if (!validate(info)) {
                    res.json(result = {
                        status: 500,
                        message: "Edit DeviceTemplate failed!"
                    });
                    return false;
                }
                const id = info.deviceTemplateId;
                delete info.deviceTemplateId;
                delete info.locationId;
                info.updatedDate = updatedDate;
                if (front) {
                    const datetime = _var.datetime;
                    const name = front.name;
                    const regex = name.match(/.[^.]+$/)[0];
                    const prevName = name.split(regex)[0].replace(/\s/g, '-');
                    _front = `${prevName}_${moment().format(datetime.fileName)}${regex}`;
                }

                if (rear) {
                    const datetime = _var.datetime;
                    const name = rear.name;
                    const regex = name.match(/.[^.]+$/)[0];
                    const prevName = name.split(regex)[0].replace(/\s/g, '-');
                    _rear = `${prevName}_${moment().format(datetime.fileName)}${regex}`;
                }
                const query = `update tbl_DeviceTemplates set ? where deviceTemplateId=?`;
                const update = await mysql.query_transaction(connection, query, [info, id]);
                if (_.isNull(update)) {
                    result = {
                        status: 500,
                        message: "Edit DeviceTemplate failed!"
                    };
                } else {
                    if (front) {
                        _path = path.join(__dirname, pathDeviceTemplates, id.toString());
                        deleteFolderRecursive(_path);
                        if (!fs.existsSync(_path)) {
                            fs.mkdirSync(_path);
                        }
                        _path1 = path.join(_path, 'front');
                        if (!fs.existsSync(_path1)) {
                            fs.mkdirSync(_path1);
                        }
                        const respImg = await insertFile(front, _path1, _front);
                        if (!respImg) {
                            connection.rollback();
                            result = {
                                status: 500,
                                message: "Edit DeviceTemplate failed!"
                            };
                            res.json(result);
                            return false;
                        }
                    }
                    if (rear) {
                        _path = path.join(__dirname, pathDeviceTemplates, id.toString());
                        deleteFolderRecursive(_path);
                        if (!fs.existsSync(_path)) {
                            fs.mkdirSync(_path);
                        }
                        _path1 = path.join(_path, 'rear');
                        if (!fs.existsSync(_path1)) {
                            fs.mkdirSync(_path1);
                        }
                        const respImg = await insertFile(rear, _path1, _rear);
                        if (!respImg) {
                            connection.rollback();
                            result = {
                                status: 500,
                                message: "Edit DeviceTemplate failed!"
                            };
                            res.json(result);
                            return false;
                        }
                    }
                    result = {
                        status: 200,
                        message: "Edit Device Template successful!",
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
                controller: 'deviceTemplates-controller',
                function: 'updateDeviceTemplate',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: body,
                // user: user
            });
            result = {
                status: 500,
                message: "Edit DeviceTemplates failed!"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'deviceTemplates-controller',
            function: 'updateDeviceTemplate',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Edit DeviceTemplates failed!"
        };
        res.json(result);
    }
}

function deleteDeviceTemplate(req, res) {
    const query = req.query;
    let result = {};
    try {
        const id = query.id;
        mysql.query(`delete from tbl_DeviceTemplates where deviceTemplateId=?`, parseInt(id), resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    message: "Remove DeviceTemplate failed!"
                };
            } else {
                let _path = path.join(__dirname, pathDeviceTemplates, id.toString());
                deleteFolderRecursive(_path);
                result = {
                    status: 200,
                    message: "Remove DeviceTemplate successful!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'deviceTemplates-controller',
            function: 'deleteDeviceTemplate',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Remove DeviceTemplate failed!"
        };
        res.json(result);
    }
}

function validate(data) {
    if (!data.deviceTemplateName) {
        return false;
    }

    if (!data.deviceTypeId) {
        return false;
    }

    if (!data.maxPower) {
        return false;
    }

    if (!data.powerModule) {
        return false;
    }

    if (!data.weight) {
        return false;
    }

    if (!data.height) {
        return false;
    }

    if (!data.manufacturer) {
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
            controller: 'deviceTemplates-controller',
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
                        controller: 'deviceTemplates-controller',
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

async function importDeviceTemplate(req, res) {
    const body = req.body;
    let result = {};
    const user = await base.getSession(req);
    try {
        const createdDate = new Date();
        // const
        let data = [];
        let dataInsert = [];
        let promises = [];
        let deviceTemplates = body.deviceTemplates;
        const length = deviceTemplates.length;
        const status = 1;
        let error = [];

        const deviceTypes = await new Promise(resolve => {
            mysql.query('select * from tbl_DeviceTypes', null, resp => {
                let result = [];
                if (!_.isNull(resp)) {
                    result = resp;
                }
                resolve(result);
            });
        });

        const query = `insert into tbl_DeviceTemplates (deviceTemplateName, deviceTypeId, CPU, RAM, disk, maxPower, powerModule, weight, height, manufacturer, front, rear, description, createdDate, createdBy, status) values ?;`;

        for (let i = 0; i < length; i++) {
            const item = deviceTemplates[i];
            let name = item.name.toString().trim();
            let deviceTypeName = item.deviceTypeName.toString().trim();
            let CPU = item.CPU;
            let RAM = item.RAM;
            let Disk = item.Disk;
            let powerMax = item.powerMax;
            let powerModule = item.powerModule;
            let weight = item.weight;
            let height = item.height;
            let manufacturer = item.manufacturer.toString().trim();
            let desc = item.desc.toString().trim();
            const deviceType = _.find(deviceTypes, {deviceTypeName: deviceTypeName});
            const deviceTypeId = deviceType ? deviceType.deviceTypeId : '';
            if (!deviceTypeId) {
                error.push(i + 2);
                continue;
            }
            item.deviceTypeId = deviceTypeId;

            if (name && _.findIndex(data, {name: name, deviceTypeId: deviceTypeId}) === -1) {
                data.push({
                    name,
                    CPU,
                    RAM,
                    Disk,
                    powerMax,
                    powerModule,
                    weight,
                    height,
                    manufacturer,
                    description: desc,
                    createdDate,
                    deviceTypeId,
                    createdBy: user.userId,
                    status
                });
                const temp = [
                    name,
                    deviceTypeId,
                    CPU,
                    RAM,
                    Disk,
                    powerMax,
                    powerModule,
                    weight,
                    height,
                    manufacturer,
                    '',
                    '',
                    desc,
                    createdDate,
                    user.userId,
                    status
                ];

                dataInsert.push(temp);
                //
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
                        message: 'Import Device template successful!'
                    };
                }
            } else {
                result = {
                    status: 500,
                    message: 'Import Device template failed!'
                };
            }

            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'device-templates-controller',
            function: 'importDeviceTemplate',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Import Device template failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllDeviceTemplate,
    getDeviceTemplates,
    insertDeviceTemplate,
    updateDeviceTemplate,
    deleteDeviceTemplate,
    getDeviceTemplateById,
    importDeviceTemplate,
};