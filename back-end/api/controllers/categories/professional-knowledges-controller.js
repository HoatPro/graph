'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

async function getProfessionalKnowledges(req, res) {
    const query = req.query;
    let result = {};
    let promises = [];
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const tables = _var.tables;
        const professionalKnowledges = tables.professionalKnowledges;
        const columns = professionalKnowledges.columns;
        const conditions = {
            table: professionalKnowledges.name,
            order: {
                tables: professionalKnowledges.name,
                column: columns.id,
                type: "ASC"
            },
        };

        // count all records of users
        const count = await new Promise(resolve => {
            mysql.count(conditions, resp => {
                resolve(resp);
            })
        });

        const countPage = ~~((count - 1) / pagination.sizePage) + 1;
        if (count === 0) {
            result = {
                status: 200,
                professionalKnowledges: {
                    data: []
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get professional Knowledges successful!"
            };
        } else {
            // get professionalKnowledges by pagination
            const getProfessionalKnowledges = await new Promise(resolve => {
                const temp = {
                    ...conditions,
                    limit: {
                        from: pagination.currentPage * pagination.sizePage,
                        size: pagination.sizePage
                    },
                };
                mysql.search(temp, resp => {
                    resolve(resp);
                });
            });
            result = {
                status: 200,
                professionalKnowledges: {
                    data: getProfessionalKnowledges
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get professional Knowledges successful!"
            };
        }
        res.json(result);
    } catch (error) {
        elk.error({
            type: 'error',
            controller: 'professional-knowledges-controller',
            function: 'getProfessionalKnowledges',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Professional Knowledges failed!"
        };
        res.json(result);
    }
}

async function insertProfessionalKnowledge(req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables;
        const professionalKnowledge = table.professionalKnowledges;
        const columns = professionalKnowledge.columns;
        let conditions = {
            table: professionalKnowledge.name,
            columns: {
                [columns.name]: body.name,
            }
        };

        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi thêm Nghiệp Vụ!"
                };
            } else {
                conditions.columns.professionalKnowledgeId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Thêm Nghiệp Vụ thành công!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            type: 'error',
            controller: 'professional-knowledges-controller',
            function: 'insertProfessionalKnowledge',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi Thêm Nghiệp Vụ!"
        };
        res.json(result);
    }
}

function updateProfessionalKnowledge(req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.professionalKnowledges;
        const tableName = table.name;
        const columns = table.columns;
        const updatedDate = new Date();

        let conditions = {
            table: tableName,
            columns: {
                [columns.name]: body.name,
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.professionalKnowledgeId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi cập nhật Nghiệp Vụ!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Cập nhật Nghiệp Vụ thành công!",
                    data: {
                        ...body,
                        updatedDate: updatedDate
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            type: 'error',
            controller: 'professional-knowledges-controller',
            function: 'updateProfessionalKnowledge',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi cập nhật Nghiệp Vụ!"
        };
        res.json(result);
    }
}

function deleteProfessionalKnowledge(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.professionalKnowledges;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.professionalKnowledgeId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi xóa Nghiệp Vụ!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Xóa Nghiệp Vụ thành công!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'professional-knowledges-controller',
            function: 'deleteProfessionalKnowledge',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Lỗi xóa Nghiệp Vụ!"
        };
        res.json(result);
    }
}

module.exports = {
    getProfessionalKnowledges,
    insertProfessionalKnowledge,
    updateProfessionalKnowledge,
    deleteProfessionalKnowledge,
};