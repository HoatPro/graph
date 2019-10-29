'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllCabTypes(req, res){
    const body = req.body;
    let result = [];
    try{
        const cabtypes = _var.tables.cabtypes;
        const columns = cabtypes.columns;
        const conditions = {
            table: cabtypes.name,
            order: {
                column: columns.createdDate,
                type: "DESC"
            },
        };

        mysql.search(conditions, (resp) => {
            let temp = [];
            if(!_.isNull(resp)) {
                temp = resp;
            }
            result = temp;
            res.json(result);
        });
    }
    catch (error){
        elk.error({
            controller: 'cabtypes-controller',
            function: 'getAllCabTypes',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "getAllCabTypes failed!"
        };
        res.json(result);
    }
}

function getCabTypes(req, res){
    const query = req.query;
    let result = {};
    let promises = [];
    try{
        const _pagination = JSON.parse(query.pagination);
        const search = JSON.parse(query.search);
        const pagination = {
            currentPage: _pagination.currentPage ? parseInt(_pagination.currentPage): _var.pagination.currentPage,
            sizePage: _pagination.sizePage ? parseInt(_pagination.sizePage) : _var.pagination.sizePage,
        };
        const cabtypes = _var.tables.cabtypes;
        const columns = cabtypes.columns;
        const conditions = {
            table: cabtypes.name,
            order: {
                column: columns.id,
                type: "DESC"
            },
            where:{
                and: [
                    { column: `${cabtypes.name}.${columns.attribute}`, value: `%${search.attribute}%`, compare: 'LIKE' },
                ]
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
                    from: pagination.currentPage*pagination.sizePage,
                    size: pagination.sizePage
                }
            };
            mysql.search(temp, (resp) => {
                resolve(resp);
            });
        });
        promises.push(promise1);

        Promise.all(promises).then(resp => {
            const count =                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         resp[0];
            const data = resp[1];
            let temp = [];
            if(!_.isNull(data)) {
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
                message: "Get cabtypes successful!"
            };
            res.json(result);
        });

    }
    catch (error){
        elk.error({
            controller: 'cabtypes-controller',
            function: 'getCabTypes',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getCabTypes failed!"
        };
        res.json(result);
    }
}

function insertCabType (req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const table =  _var.tables.cabtypes;
        const columns = table.columns;
        let conditions = {
            table: table.name,
            columns: {
                [columns.name]: body.name,
                [columns.attribute]: body.attribute,
                [columns.desc]: body.desc,
                [columns.status]: body.status ? 1 : 0,
                [columns.createdDate]: createdDate,
            }
        };

        mysql.insert(conditions, resp => {
            if(_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Add CabTypes failed!"
                };
            } else {
                conditions.columns.cabTypeId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Add CabTypes successful!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    }
    catch (error) {
        elk.error({
            controller: 'cabtypes-controller',
            function: 'insertCabType',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add CabTypes failed!"
        };
        res.json(result);
    }
}

function updateCabType (req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.cabtypes;
        const tableName = table.name;
        const columns = table.columns;
        const updatedDate = new Date();

        const conditions = {
            table: tableName,
            columns: {
                [columns.name]: body.name,
                [columns.attribute]: body.attribute,
                [columns.desc]: body.desc,
                [columns.status]: body.status ? 1 : 0,
                [columns.updatedDate]: updatedDate,
            },
            where: {
                and: [
                    { column: `${tableName}.${columns.id}`, value: body.cabTypeId, compare: '=' }
                ]
            }
        };

        mysql.update(conditions, resp => {
            if(_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Update CabTypes failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Update CabTypes successful!",
                    data: {
                        ...body,
                        updatedDate: updatedDate
                    }
                };
            }
            res.json(result);
        });
    }
    catch (error) {
        elk.error({
            controller: 'cabtypes-controller',
            function: 'updateCabType',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update CabTypes failed!"
        };
        res.json(result);
    }
}

function deleteCabType(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.cabtypes;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    { column: `${tableName}.${columns.id}`, value: query.cabTypeId, compare: '=' }
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if(_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete CabType failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete CabType successful!",
                };
            }
            res.json(result);
        })
    }
    catch (error) {
        elk.error({
            controller: 'cabtypes-controller',
            function: 'deleteCabType',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Delete CabType failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllCabTypes,
    getCabTypes,
    insertCabType,
    updateCabType,
    deleteCabType,
};