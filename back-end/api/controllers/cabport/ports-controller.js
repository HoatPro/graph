'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

async function getPorts(req, res){
    const query = req.query;
    let result = [];
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const ports = _var.tables.ports;
        const columnsPorts = ports.columns;
        const porttypes = _var.tables.porttypes;
        const columnsPortTypes = porttypes.columns;
        const datacenter = _var.tables.dataCenter;
        const columnsDatacenter = datacenter.columns;
        const room = _var.tables.room;
        const columnsRoom = room.columns;
        const rack = _var.tables.racks;
        const columnsRack = rack.columns;
        const zone = _var.tables.zone;
        const columnsZone = zone.columns;

        const conditions = {
            table: ports.name,
            order: {
                column: columnsPorts.createdDate,
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
            const conditions2 = {
                table: porttypes.name,
                order: {
                    column: columnsPortTypes.createdDate,
                    type: "ASC"
                },
            };

            const getPortTypes = await new Promise(resolve => {
                mysql.search(conditions2, (resp) => {
                    resolve(resp);
                })
            });

            const listPortTypes = getPortTypes.map((porttypes) => {
                return {value: porttypes.portTypeId.toString(), label: porttypes.portTypeName}
            });
            result = {
                status: 200,
                message: "Get Ports success!",
                ports: {
                    data: [],
                    listPortTypes: listPortTypes,
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
            }
        }
        else {
            const getPorts = await new Promise(resolve => {
                const conditions1 = {
                    ...conditions,
                    select: [
                        {
                            table: ports.name,
                            columns: [
                                {name: columnsPorts.id},
                                {name: columnsPorts.name},
                                {name: columnsPorts.portTypeId},
                                {name: columnsPorts.desc},
                                {name: columnsPorts.createdDate},
                                {name: columnsPorts.updatedDate},
                                {name: columnsPorts.status},
                            ]
                        },
                        {
                            table: porttypes.name,
                            columns: [
                                {name: columnsPortTypes.id, as: 'portTypeId'},
                                {name: columnsPortTypes.name, as: 'portTypeName'},
                            ]
                        },
                    ],
                    join: {
                        join: [
                            {
                                table: porttypes.name,
                                conditions: {
                                    [porttypes.name]: columnsPortTypes.id,
                                    [ports.name]: columnsPorts.portTypeId
                                }
                            },
                        ]
                    },
                    limit: {
                        from: pagination.currentPage * pagination.sizePage,
                        size: pagination.sizePage
                    }
                };
                mysql.search(conditions1, resp => {
                    resolve(resp);
                });
            });

            const conditions2 = {
                table: porttypes.name,
                order: {
                    column: columnsPortTypes.createdDate,
                    type: "ASC"
                },
            };

            const getPortTypes = await new Promise(resolve => {
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
                });
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

            const conditions5 = {
                table: rack.name,
                order: {
                    column: columnsRack.createdDate,
                    type: "ASC"
                }
            };
            const getRack = await new Promise(resolve => {
                mysql.search(conditions5, (resp) => {
                    resolve(resp);
                })
            });

            const conditions6 = {
                table: zone.name,
                order: {
                    column: columnsRack.createdDate,
                    type: "ASC"
                }
            };
            const getZone = await new Promise(resolve => {
                mysql.search(conditions6, (resp) => {
                    resolve(resp);
                })
            });

            if (_.isNull(getPorts) || _.isNull((getPortTypes))|| _.isNull((getDatacenter))|| _.isNull((getRoom))|| _.isNull((getRack))|| _.isNull((getZone))) {
                result = {
                    status: 500,
                    message: "Get Ports failed!"
                };
            }
            else {
                const listPortTypes = getPortTypes.map((porttypes) => {
                    return {value: porttypes.portTypeId.toString(), label: porttypes.portTypeName}
                });
                const listDatacenter = getDatacenter.map((datacenter) => {
                    return {value: datacenter.dataCenterId.toString(), label: datacenter.dataCenterName}
                });
                const listRoom = getRoom.map((room) => {
                    return {value: room.roomId.toString(), label: room.roomName}
                });
                const listZone = getZone.map((zone) => {
                    return {value: zone.zoneId.toString(), label: zone.zoneName}
                });
                const listRack = getRack.map((rack) => {
                    return {value: rack.rackId.toString(), label: rack.rackName}
                });

                result = {
                    status: 200,
                    message: "Get Ports success!",
                    ports: {
                        data: getPorts,
                        dataPortTypes: getPortTypes,
                        dataDataCenter: getDatacenter,
                        dataRoom: getRoom,
                        dataZone: getZone,
                        dataRack: getRack,
                        listPortTypes: listPortTypes,
                        listDatacenter: listDatacenter,
                        listRoom: listRoom,
                        listZone: listZone,
                        listRack: listRack,
                    },
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    }
                };
            }
            res.json(result);
        }
    }
    catch (error){
        elk.error({
            controller: 'ports-controller',
            function: 'getPorts',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Ports failed!"
        };
        res.json(result);
    }
}

async function insertPort (req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const tables = _var.tables;
        const ports = tables.ports;
        const portColumns = ports.columns;

        let conditions = {
            table: ports.name,
            columns: {
                [portColumns.name]: body.name,
                [portColumns.portTypeId]: body.portTypeId,
                [portColumns.desc]: body.desc,
                [portColumns.status]: body.status ? 1 : 0,
                [portColumns.createdDate]: createdDate,
            }
        };
        const insertPort = await new Promise(resolve => {
            mysql.insert(conditions, resp => {
                resolve(resp);
            });
        });

        if(_.isNull(insertPort.data)) {
            result = {
                status: 500,
                message: "Add Port failed!"
            };
        } else {
            result = {
                status: 200,
                message: "Add Port successful!",
            };
        }
        res.json(result);
    }
    catch (error) {
        elk.error({
            controller: 'ports-controller',
            function: 'insertPort',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body,
        });
        result = {
            status: 500,
            message: "Add Port failed!"
        };
        res.json(result);
    }
}

async function updatePort (req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const ports = tables.ports;
        const portColumns = ports.columns;
        const updatedDate = new Date();

        const conditions = {
            table: ports.name,
            columns: {
                [portColumns.name]: body.name,
                [portColumns.desc]: body.desc,
                [portColumns.portTypeId]: body.portTypeId,
                [portColumns.updatedDate]: updatedDate,
            },
            where: {
                and: [
                    { column: `${ports.name}.${portColumns.id}`, value: body.portId, compare: '=' }
                ]
            }
        };
        const updatePort = await new Promise(resolve => {
            mysql.update(conditions, resp => {
                resolve(resp);
            });
        });
        if(_.isNull(updatePort.data)) {
            result = {
                status: 500,
                message: updatePort.message ? updatePort.message : "Update Port failed!"
            };
            res.json(result);
        } else {
            result = {
                status: 200,
                message: "Update Port successful!",
                data: {
                    ...body,
                    updatedDate: updatedDate
                }
            };
        }
        res.json(result);
    }
    catch (error) {
        // console.error('updatePort_ports-controller', { error: e, data: body });
        elk.error({
            controller: 'ports-controller',
            function: 'updatePort',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update Port failed!"
        };
        res.json(result);
    }
}

function deletePort(req, res) {
    const body = req.query;
    let result = {};
    try {
        const table = _var.tables.ports;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    { column: `${tableName}.${columns.id}`, value: body.portId, compare: '=' }
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if(_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete Port failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete Port successful!",
                };
            }
            res.json(result);
        })
    }
    catch (error) {
        // console.error('deletePort_Port-controller', { error: e, data: body });
        elk.error({
            controller: 'ports-controller',
            function: 'deletePort',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Delete Port failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getPorts,
    insertPort,
    deletePort,
    updatePort,
};