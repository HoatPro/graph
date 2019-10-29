'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

async function getCabs(req, res){
    const query = req.query;
    let result = [];
    try {
        const _pagination = JSON.parse(query.pagination);
        const search = JSON.parse(query.search);
        const pagination = {
            currentPage: _pagination.currentPage ? parseInt(_pagination.currentPage): _var.pagination.currentPage,
            sizePage: _pagination.sizePage ? parseInt(_pagination.sizePage) : _var.pagination.sizePage,
        };
        const cabs = _var.tables.cabs;
        const columnsCabs = cabs.columns;
        const cabtypes = _var.tables.cabtypes;
        const columnsCabTypes = cabtypes.columns;
        const conditions = {
            table: cabs.name,
            order: {
                column: columnsCabs.createdDate,
                type: "ASC"
            },
            where:{
                and: [
                    { column: `${cabs.name}.${columnsCabs.name}`, value: `%${search.name}%`, compare: 'LIKE' },
                ]
            },
        };

        const count = await new Promise(resolve => {
            mysql.count(conditions, resp => {
                resolve(resp);
            })
        });
        const countPage = ~~((count - 1) / pagination.sizePage) + 1;

        if (count === 0) {
            const getCabTypes = await new Promise(resolve => {
                const conditions2 = {
                    table: cabtypes.name,
                    order: {
                        column: columnsCabTypes.createdDate,
                        type: "ASC"
                    },
                };
                mysql.search(conditions2, (resp) => {
                    resolve(resp);
                })
            });

            const listCabTypes = getCabTypes.map((cabtypes) => {
                return {value: cabtypes.cabTypeId.toString(), label: cabtypes.cabTypeName}
            });
            result = {
                status: 200,
                message: "Get Cabs success!",
                cabs: {
                    data: [],
                    listCabTypes: listCabTypes,
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
            }
        }
        else {
            const getCabs = await new Promise(resolve => {
                const conditions1 = {
                    ...conditions,
                    select: [
                        {
                            table: cabs.name,
                            columns: [
                                {name: columnsCabs.id},
                                {name: columnsCabs.name},
                                {name: columnsCabs.cabTypeId},
                                {name: columnsCabs.width},
                                {name: columnsCabs.desc},
                                {name: columnsCabs.createdDate},
                                {name: columnsCabs.updatedDate},
                                {name: columnsCabs.status},
                            ]
                        },
                        {
                            table: cabtypes.name,
                            columns: [
                                {name: columnsCabTypes.id, as: 'cabTypeId'},
                                {name: columnsCabTypes.name, as: 'cabTypeName'},
                            ]
                        },
                    ],
                    join: {
                        join: [
                            {
                                table: cabtypes.name,
                                conditions: {
                                    [cabtypes.name]: columnsCabTypes.id,
                                    [cabs.name]: columnsCabs.cabTypeId
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

            const getCabTypes = await new Promise(resolve => {
                const conditions2 = {
                    table: cabtypes.name,
                    order: {
                        column: columnsCabTypes.createdDate,
                        type: "ASC"
                    },
                };
                mysql.search(conditions2, (resp) => {
                    resolve(resp);
                })
            });

            if (_.isNull(getCabs) || _.isNull((getCabTypes))) {
                result = {
                    status: 500,
                    message: "Get Cabs failed!"
                };
            }
            else {
                const listCabTypes = getCabTypes.map((cabtypes) => {
                    return {value: cabtypes.cabTypeId.toString(), label: cabtypes.cabTypeName}
                });
                result = {
                    status: 200,
                    message: "Get Cabs success!",
                    cabs: {
                        data: getCabs,
                        data2: getCabTypes,
                        listCabTypes: listCabTypes
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
            controller: 'cabs-controller',
            function: 'getCabs',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Cabs failed!"
        };
        res.json(result);
    }
}

async function insertCab (req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const tables = _var.tables;
        const cabs = tables.cabs;
        const cabColumns = cabs.columns;

        let conditions = {
            table: cabs.name,
            columns: {
                [cabColumns.name]: body.name,
                [cabColumns.cabTypeId]: body.cabTypeId,
                [cabColumns.width]: body.width,
                [cabColumns.desc]: body.desc,
                [cabColumns.status]: body.status ? 1 : 0,
                [cabColumns.createdDate]: createdDate,
            }
        };
        const insertCab = await new Promise(resolve => {
            mysql.insert(conditions, resp => {
                resolve(resp);
            });
        });

        if(_.isNull(insertCab.data)) {
            result = {
                status: 500,
                message: "Add CabPort failed!"
            };
        } else {
            result = {
                status: 200,
                message: "Add CabPort successful!",
            };
        }
        res.json(result);
    }
    catch (error) {
        elk.error({
            controller: 'cabs-controller',
            function: 'insertCab',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body,
        });
        result = {
            status: 500,
            message: "Add CabPort failed!"
        };
        res.json(result);
    }
}

async function updateCab (req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const cabs = tables.cabs;
        const cabColumns = cabs.columns;
        const updatedDate = new Date();

        const conditions = {
            table: cabs.name,
            columns: {
                [cabColumns.name]: body.name,
                [cabColumns.desc]: body.desc,
                [cabColumns.width]: body.width,
                [cabColumns.cabTypeId]: body.cabTypeId,
                [cabColumns.updatedDate]: updatedDate,
            },
            where: {
                and: [
                    { column: `${cabs.name}.${cabColumns.id}`, value: body.cabId, compare: '=' }
                ]
            }
        };
        const updateCab = await new Promise(resolve => {
            mysql.update(conditions, resp => {
                resolve(resp);
            });
        });
        if(_.isNull(updateCab.data)) {
            result = {
                status: 500,
                message: updateCab.message ? updateCab.message : "Update CabPort failed!"
            };
            res.json(result);
        } else {
            result = {
                status: 200,
                message: "Update CabPort successful!",
                data: {
                    ...body,
                    updatedDate: updatedDate
                }
            };
        }
        res.json(result);
    }
    catch (error) {
        elk.error({
            controller: 'cabs-controller',
            function: 'updateCab',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update CabPort failed!"
        };
        res.json(result);
    }
}

function deleteCab(req, res) {
    const body = req.query;
    let result = {};
    try {
        const table = _var.tables.cabs;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    { column: `${tableName}.${columns.id}`, value: body.cabId, compare: '=' }
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if(_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete CabPort failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete CabPort successful!",
                };
            }
            res.json(result);
        })
    }
    catch (error) {
        elk.error({
            controller: 'cabs-controller',
            function: 'deleteCab',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Delete CabPort failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getCabs,
    insertCab,
    deleteCab,
    updateCab,
};