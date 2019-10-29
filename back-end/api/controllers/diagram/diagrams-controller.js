'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const base = require('../../base-controller');

function getAllDiagrams(req, res) {
    let result = [];
    try {
        const diagrams = _var.tables.diagrams;
        const columns = diagrams.columns;
        const conditions = {
            table: diagrams.name,
            order: {
                column: columns.createdDate,
                type: "DESC"
            },
        };

        mysql.search(conditions, (resp) => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = temp;
            res.json(result);
        });
    } catch (error) {
        // console.error('getAllDiagrams_diagrams-controller', { error: err, data: {} });
        elk.error({
            type: 'error',
            controller: 'diagrams-controller',
            function: 'getAllDiagrams',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        res.json(result);
    }
}

function getDiagrams(req, res) {
    const query = req.query;
    let result = {};
    try {
        const id = parseInt(query.id);
        const tables = _var.tables;
        const diagrams = tables.diagrams;
        const diagramsColumns = diagrams.columns;
        const conditions = {
            table: diagrams.name,
            where: {
                and: [
                    {column: `${diagrams.name}.${diagramsColumns.id}`, value: id, compare: '='}
                ]
            }
        };

        mysql.search(conditions, (resp) => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = {
                status: 200,
                data: temp,

                message: "Get diagrams successful!"
            };
            res.json(result);
        });
    } catch (error) {
        // console.error('getDiagrams_diagrams-controller', { error: err, data: {} });
        elk.error({
            controller: 'diagrams-controller',
            function: 'getDiagrams',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getDiagrams failed!"
        };
        res.json(result);
    }
}

async function insertDiagram(req, res) {
    let body = req.body;
    let result = {};
    try {
        const files = req.files;
        const background = files.background;
        let _name = '';
        let _path = '';
        if (background) {
            const datetime = _var.datetime;
            const name = background.name;
            const regex = name.match(/.[^.]+$/)[0];
            const prevName = name.split(regex)[0];
            _name = `${prevName}_${moment().format(datetime.fileName)}${regex}`;
            _path = path.join(__dirname, `../../storage/uploads/backgrounds/${_name}`);
        }
        const user = await base.getSession(req);
        if (_.size(user) === 0) {
            result = {
                status: 500,
                message: "Create Diagram failed!"
            };
            res.json(result);
            return false;
        }
        const createdDate = new Date();
        const table = _var.tables.diagrams;
        const columns = table.columns;
        let conditions = {
            table: table.name,
            columns: {
                [columns.name]: body.name,
                [columns.key]: body.key,
                [columns.desc]: body.desc,
                [columns.status]: body.status ? 1 : 0,
                [columns.createdDate]: createdDate,
                [columns.createdBy]: user.userId,
                [columns.background]: _name
            }
        };

        // insert diagram
        const respDiaram = await _insertDiagram(conditions);

        if (_.isNull(respDiaram.data)) {
            result = {
                status: 500,
                message: "Create Diagram failed!"
            };
        } else {
            const id = respDiaram.data.insertId;
            // insert background
            const respBackground = await insertBackground(background, _path);

            if (respBackground) {
                result = {
                    status: 200,
                    message: "Add Diagram successful!",
                    data: {
                        id: id
                    }
                };
            } else {
                _deleteDiagram(id);
                result = {
                    status: 500,
                    message: "Create Diagram failed!"
                };
            }
        }
        res.json(result);
    } catch (error) {
        // console.error('addDiagram_diagrams-controller', { error: e, data: body });
        elk.error({
            controller: 'diagrams-controller',
            function: 'insertDiagram',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Add Diagram failed!"
        };
        res.json(result);
    }
}

function insertBackground(background, path) {
    if (background) {
        return new Promise(resolve => {
            background.mv(path, function (error) {
                let result = true;
                if (error) {
                    result = false;
                    elk.error({
                        type: 'error',
                        controller: 'diagrams-controller',
                        function: 'insertBackground',
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

function _insertDiagram(conditions) {
    return new Promise(resolve => {
        mysql.insert(conditions, resp => {
            resolve(resp);
        });
    });
}

function _deleteDiagram(id) {
    const table = _var.tables.diagrams;
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

function updateDiagram(req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.diagrams;
        const tableName = table.name;
        const columns = table.columns;
        const updatedDate = new Date();

        const conditions = {
            table: tableName,
            columns: {
                [columns.name]: body.name,
                [columns.desc]: body.desc,
                [columns.status]: body.status ? 1 : 0,
                [columns.updatedDate]: updatedDate,
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.diagramId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Update Diagram failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Update Diagram successful!",
                    data: {
                        ...body,
                        updatedDate: updatedDate
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        // console.error('updateDiagram_diagrams-controller', { error: e, data: body });
        elk.error({
            controller: 'diagrams-controller',
            function: 'updateDiagram',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update Diagram failed!"
        };
        res.json(result);
    }
}

function deleteDiagram(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.diagrams;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.diagramId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Delete Diagram failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Delete Diagram successful!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        // console.error('deleteDiagram_diagrams-controller', { error: e, data: query });
        elk.error({
            controller: 'diagrams-controller',
            function: 'deleteDiagram',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Delete Diagram failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllDiagrams,
    getDiagrams,
    insertDiagram,
    updateDiagram,
    deleteDiagram,
};