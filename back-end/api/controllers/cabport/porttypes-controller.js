'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllPortTypes(req, res){
    let result = [];
    try{
        const porttypes = _var.tables.porttypes;
        const columns = porttypes.columns;
        const conditions = {
            table: porttypes.name,
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
        // console.error('getAllPortTypes_porttypes-controller', { error: err, data: {} });
        elk.error({
            controller: 'porttypes-controller',
            function: 'getAllPortTypes',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        res.json(result);
    }
}

function getPortTypes(req, res){
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
        const porttypes = _var.tables.porttypes;
        const columns = porttypes.columns;
        const conditions = {
            table: porttypes.name,
            order: {
                column: columns.id,
                type: "DESC"
            },
            where:{
                and: [
                    { column: `${porttypes.name}.${columns.attribute}`, value: `%${search.attribute}%`, compare: 'LIKE' },
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
            const count = resp[0];
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
                message: "Get porttypes successful!"
            };
            res.json(result);
        });

    }
    catch (error){
        // console.error('getPortTypes_porttypes-controller', { error: err, data: {} });
        elk.error({
            controller: 'porttypes-controller',
            function: 'getPortTypes',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getPortTypes failed!"
        };
        res.json(result);
    }
}

function insertPortType (req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const table =  _var.tables.porttypes;
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
                    message: resp.message ? resp.message : "Add PortTypes failed!"
                };
            } else {
                conditions.columns.portTypeId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Add PortTypes successful!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    }
    catch (error) {
        // console.error('addPortType_porttypes-controller', { error: e, data: body });
        elk.error({
            controller: 'porttypes-controller',
            function: 'insertPortType',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add PortTypes failed!"
        };
        res.json(result);
    }
}

function updatePortType (req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.porttypes;
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
                    { column: `${tableName}.${columns.id}`, value: body.portTypeId, compare: '=' }
                ]
            }
        };

        mysql.update(conditions, resp => {
            if(_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Update PortTypes failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Update PortTypes successful!",
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
        // console.error('updatePortType_porttypes-controller', { error: e, data: body });
        elk.error({
            controller: 'porttypes-controller',
            function: 'updatePortType',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update PortTypes failed!"
        };
        res.json(result);
    }
}

function deletePortType(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.porttypes;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    { column: `${tableName}.${columns.id}`, value: query.portTypeId, compare: '=' }
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if(_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete PortType failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete PortType successful!",
                };
            }
            res.json(result);
        })
    }
    catch (error) {
        // console.error('deletePortType_porttypes-controller', { error: e, data: query });
        elk.error({
            controller: 'porttypes-controller',
            function: 'deletePortType',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Delete PortType failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllPortTypes,
    getPortTypes,
    insertPortType,
    updatePortType,
    deletePortType,
};