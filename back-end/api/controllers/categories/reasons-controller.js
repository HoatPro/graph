'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

async function getReasons(req, res) {
    const query = req.query;
    let result = {};
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const tables = _var.tables;
        const reasons = tables.reasons;
        const reasonsColumns = reasons.columns;
        const professionalKnowledges = tables.professionalKnowledges;
        const professionalKnowledgesColumns = professionalKnowledges.columns;
        const reasonTypes = tables.reasonTypes;
        const reasonTypesColumns = reasonTypes.columns;
        const conditions = {
            table: reasons.name,
            order: {
                tables: reasons.name,
                column: reasonsColumns.id,
                type: "ASC"
            },
            join: {
                join: [
                    {
                        table: professionalKnowledges.name,
                        conditions: {
                            [reasons.name]: reasonsColumns.professionalKnowledgeId,
                            [professionalKnowledges.name]: professionalKnowledgesColumns.id
                        }
                    },
                    {
                        table: reasonTypes.name,
                        conditions: {
                            [reasons.name]: reasonsColumns.reasonTypeId,
                            [reasonTypes.name]: reasonTypesColumns.id
                        }
                    }
                ]
            },
        };

        // count all records of users
        const count = await new Promise(resolve => {
            mysql.count(conditions, resp => {
                resolve(resp);
            })
        });

        const countPage = ~~((count - 1) / pagination.sizePage) + 1;

        const getProfessionalKnowledges = await new Promise(resolve => {
            const conditions2 = {
                table: professionalKnowledges.name,
                order: {
                    tables: professionalKnowledges.name,
                    column: professionalKnowledgesColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions2, (resp) => {
                resolve(resp);
            })
        });

        const listProfessionalKnowledges = getProfessionalKnowledges.map((professionalKnowledges) => {
            return {
                value: professionalKnowledges.professionalKnowledgeId.toString(),
                label: professionalKnowledges.professionalKnowledgeName
            }
        });

        const getReasonTypes = await new Promise(resolve => {
            const conditions2 = {
                table: reasonTypes.name,
                order: {
                    tables: reasonTypes.name,
                    column: reasonTypesColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions2, (resp) => {
                resolve(resp);
            })
        });

        const listReasonTypes = getReasonTypes.map((reasonTypes) => {
            return {value: reasonTypes.reasonTypeId.toString(), label: reasonTypes.reasonTypeName}
        });

        if (count === 0) {
            result = {
                status: 200,
                message: "Get Reasons success!",
                data: {
                    data: [],
                    listProfessionalKnowledges: listProfessionalKnowledges,
                    listReasonTypes: listReasonTypes
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
            };
        } else {
            // get groups by pagination
            const getReasons = await new Promise(resolve => {
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
                reasons: {
                    data: getReasons,
                    listProfessionalKnowledges: listProfessionalKnowledges,
                    listReasonTypes: listReasonTypes
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get reasons successful!"
            };
        }
        res.json(result);
    } catch (error) {
        elk.error({
            controller: 'reasons-controller',
            function: 'getReasons',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get reasons failed!"
        };
        res.json(result);
    }
}

async function insertReason(req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const reasons = tables.reasons;
        const reasonColumns = reasons.columns;
        let conditions = {
            table: reasons.name,
            columns: {
                [reasonColumns.name]: body.name,
                [reasonColumns.reasonTypeId]: body.reasonTypeId,
                [reasonColumns.professionalKnowledgeId]: body.professionalKnowledgeId,
                [reasonColumns.desc]: body.desc,
            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi thêm Lý Do Xuất Nhập!"
                };
            } else {
                conditions.columns.reasonId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Thêm Lý Do Xuất Nhập thành công!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'reasons-controller',
            function: 'insertReason',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi thêm Lý Do Xuất Nhập"
        };
        res.json(result);
    }
}

function updateReason(req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.reasons;
        const tableName = table.name;
        const columns = table.columns;

        let conditions = {
            table: tableName,
            columns: {
                [columns.name]: body.name,
                [columns.reasonTypeId]: body.reasonTypeId,
                [columns.professionalKnowledgeId]: body.professionalKnowledgeId,
                [columns.desc]: body.desc,
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.reasonId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi sửa Lý Do Xuất Nhập!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Sửa Lý Do Xuất Nhập thành công!",
                    reason: {
                        ...body,
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'reasons-controller',
            function: 'updateReasons',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi sửa Lý Do Xuất Nhập!"
        };
        res.json(result);
    }
}

function deleteReason(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.reasons;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.reasonId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi xóa Lý Do Xuất Nhập!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Xóa Lý Do Xuất Nhập thành công!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'reasons-controller',
            function: 'deleteReason',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Lỗi xóa Hàng Hóa!"
        };
        res.json(result);
    }
}

// async function searchReasons(req, res){
//     const query = req.query;
//     let result = {};
//     try {
//         const _pagination = JSON.parse(query.pagination);
//         const search = JSON.parse(query.search);
//         const pagination = {
//             currentPage: _pagination.currentPage ? parseInt(_pagination.currentPage) : _var.pagination.currentPage,
//             sizePage: _pagination.sizePage ? parseInt(_pagination.sizePage) : _var.pagination.sizePage,
//         };
//         const name = search.name;
//
//         const conditions = `select count(reasonId) as count from (
//                             SELECT * FROM tbl_Reasons
//                             WHERE tbl_Reasons.reasonName LIKE ?
//                             GROUP BY tbl_Reasons.reasonId)as t`;
//         const count = await new Promise(resolve => {
//             mysql.query(conditions, [`%${name}%`], resp => {
//                 let result = 0;
//                 if (resp) {
//                     result = resp[0].count;
//                 }
//                 resolve(result);
//             })
//         });
//
//         const countPage = ~~((count - 1) / pagination.sizePage) + 1;
//         if (count === 0) {
//             result = {
//                 status: 200,
//                 reasons: {
//                     data: [],
//                 },
//                 pagination: {
//                     currentPage: pagination.currentPage,
//                     countPage: countPage,
//                     sizePage: pagination.sizePage
//                 },
//                 message: "Get reasons successful!"
//             };
//         } else {
//             const respReasons = await new Promise(resolve => {
//                 const queryStr = `SELECT * FROM tbl_Reasons
//                                  WHERE tbl_reasons.reasonName LIKE ?
//                                  order by reasonId LIMIT ?,?`;
//                 mysql.query(queryStr, [`%${name}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
//                     resolve(resp);
//                 });
//             });
//             if (_.size(respReasons) > 0) {
//                 result = {
//                     status: 200,
//                     reasons: {
//                         data: respReasons,
//                     },
//                     pagination: {
//                         currentPage: pagination.currentPage,
//                         countPage: countPage,
//                         sizePage: pagination.sizePage
//                     },
//                     message: "Get reasons successful!"
//                 };
//             } else {
//                 result = {
//                     status: 200,
//                     data: [],
//                     pagination: {
//                         currentPage: pagination.currentPage,
//                         countPage: countPage,
//                         sizePage: pagination.sizePage
//                     },
//                     message: "Get reasons successful!"
//                 };
//             }
//             res.json(result);
//         }
//     }
//     catch (error){
//         elk.error({
//             controller: 'reasons-controller',
//             function: 'searchReasons',
//             error: err,
//             data: query
//         });
//         result = {
//             status: 500,
//             message: "Search reasons failed!"
//         };
//         res.json(result);
//     }
// }

function getAllReason(req, res) {
    let result = {};
    let query = req.query;
    try {
        let queryStr = '';
        let value = null;
        if (_.size(query) > 0) {
            queryStr = `select * from tbl_Reasons join tbl_ReasonTypes on tbl_ReasonTypes.reasonTypeId=tbl_Reasons.reasonTypeId where tbl_Reasons.reasonTypeId=? order by reasonName `;
            value = [query.reasonType];
        } else {
            queryStr = `select * from tbl_Reasons order by reasonName`;
        }

        mysql.query(queryStr, value, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get all reason failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get all reason successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'reasons-controller',
            function: 'getALlReason',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get all reason failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllReason,
    getReasons,
    insertReason,
    deleteReason,
    updateReason,
    // searchReasons,
};