'use strict';
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const base = require('../../base-controller');

function getAllProduct(req, res) {
    let result = {};
    try {
        const queryStr = `SELECT * FROM tbl_Products join tbl_Units on tbl_Products.unitId = tbl_Units.unitId`;
        mysql.query(queryStr, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get all product failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get all product successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'products-controller',
            function: 'getAllProduct',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get all product failed!"
        };
        res.json(result);
    }
}

async function getProducts(req, res) {
    const query = req.query;
    let result = {};
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const tables = _var.tables;
        const products = tables.products;
        const productColumns = products.columns;
        const types = tables.types;
        const typesColumns = types.columns;
        const groupMaterials = tables.groupMaterials;
        const groupMaterialsColumns = groupMaterials.columns;
        const units = tables.units;
        const unitsColumn = units.columns;
        const conditions = {
            table: products.name,
            order: {
                tables: products.name,
                column: productColumns.id,
                type: "ASC"
            },
            join: {
                join: [
                    {
                        table: types.name,
                        conditions: {
                            [products.name]: productColumns.typeId,
                            [types.name]: typesColumns.id
                        }
                    },
                    {
                        table: groupMaterials.name,
                        conditions: {
                            [products.name]: productColumns.groupMaterialId,
                            [groupMaterials.name]: groupMaterialsColumns.id
                        }
                    },
                    {
                        table: units.name,
                        conditions: {
                            [products.name]: productColumns.unitId,
                            [units.name]: unitsColumn.id
                        }
                    },
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

        const getTypes = await new Promise(resolve => {
            const conditions1 = {
                table: types.name,
                order: {
                    tables: types.name,
                    column: typesColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions1, (resp) => {
                resolve(resp);
            })
        });

        const listTypes = getTypes.map((types) => {
            return {value: types.typeId.toString(), label: types.typeName}
        });

        const getGroupMaterials = await new Promise(resolve => {
            const conditions2 = {
                table: groupMaterials.name,
                order: {
                    tables: groupMaterials.name,
                    column: groupMaterialsColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions2, (resp) => {
                resolve(resp);
            })
        });

        const listGroupMaterials = getGroupMaterials.map((groupMaterials) => {
            return {value: groupMaterials.groupMaterialId.toString(), label: groupMaterials.groupMaterialName}
        });

        const getUnits = await new Promise(resolve => {
            const conditions3 = {
                table: units.name,
                order: {
                    tables: units.name,
                    column: unitsColumn.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions3, (resp) => {
                resolve(resp);
            })
        });

        const listUnits = getUnits.map((units) => {
            return {value: units.unitId.toString(), label: units.unitName}
        });

        if (count === 0) {
            result = {
                status: 200,
                data: {
                    data: [],
                    listTypes: listTypes,
                    listGroupMaterials: listGroupMaterials,
                    listUnits: listUnits,
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get product successful!"
            };
        } else {
            // get groups by pagination
            const getProducts = await new Promise(resolve => {
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
                data: {
                    data: getProducts,
                    listTypes: listTypes,
                    listGroupMaterials: listGroupMaterials,
                    listUnits: listUnits,
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get products successful!"
            };
        }
        res.json(result);
    } catch (error) {
        elk.error({
            controller: 'products-controller',
            function: 'getProducts',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Products failed!"
        };
        res.json(result);
    }
}

// name, code, serial
function getProductsByQuery(req, res) {
    let query = req.query;
    let result = {};
    try {
        const str = `%${query.str}%`;
        const queryStr = `select p.productId, p.productCode, p.productName, p.groupMaterialId, s.serialId, s.serial, p.manageBySerial, p.typeId, p.unitId,
        p.status, p.createdBy, p.createdDate, p.updatedBy, p.updatedDate, u.unitName, u.shortName as shortNameUnit,
        t.typeName, t.typeCode, g.groupMaterialCode, g.groupMaterialName
        from tbl_Products as p
        join tbl_Units as u on p.unitId = u.unitId
        left join tbl_Serials as s on p.productId = s.productId
        left join tbl_Types as t on p.typeId = t.typeId
        left join tbl_GroupMaterials as g on p.groupMaterialId = g.groupMaterialId
        where p.productCode like ? or p.productName like ? or s.serial like ?
        ORDER BY p.productCode`;
        mysql.query(queryStr, [str, str, str], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get products failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get products successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'products-controller',
            function: 'getProductsByQuery',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get products failed!"
        };
        res.json(result);
    }
}

// name, code
function getProductsByNameCode(req, res) {
    let query = req.query;
    let result = {};
    try {
        const str = `%${query.str}%`;
        const queryStr = `select p.productId, p.productCode, p.productName, SUM(quality) as inventory, p.groupMaterialId, p.manageBySerial, p.typeId, p.unitId,
                            p.status, p.createdBy, p.createdDate, p.updatedBy, p.updatedDate, p.unitName, p.shortNameUnit as shortNameUnit,
                            p.typeName, p.typeCode, p.groupMaterialCode,p.groupMaterialName
                            from (select p.productId, p.productCode, p.productName,s.serial, IFNULL(st.quality,0) as quality, p.groupMaterialId, p.manageBySerial, p.typeId, p.unitId,
                                        p.status, p.createdBy, p.createdDate, p.updatedBy, p.updatedDate, u.unitName, u.shortName as shortNameUnit,
                                        t.typeName, t.typeCode, g.groupMaterialCode, g.groupMaterialName
                                        from tbl_Products as p
                                        join tbl_Units as u on p.unitId = u.unitId
                                        left join tbl_Types as t on p.typeId = t.typeId
                                        left join tbl_Serials as s on s.productId = p.productId
                                        left join tbl_Stocks as st on st.serialId = s.serialId
                                        left join tbl_GroupMaterials as g on p.groupMaterialId = g.groupMaterialId
                                        where (p.productCode like BINARY ? or p.productName like BINARY ?) and st.placeId = ?
                                        ORDER BY p.productName)
                            as p  GROUP BY productCode, productId
                            order by productCode;`;
        mysql.query(queryStr, [str, str, query.placeId], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get products failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get products successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'products-controller',
            function: 'getProductsByNameCode',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get products failed!"
        };
        res.json(result);
    }
}

// name, code
function getProductsByName(req, res) {
    let query = req.query;
    let result = {};
    try {
        const str = `%${query.str.toLocaleLowerCase()}%`;
        const online = query.online === 'true';
        let queryStr = '';
        if (online) {
            queryStr = `select p.productId, p.productCode, p.productName,s.serial, IFNULL(st.quality,0) as inventory, p.groupMaterialId, p.manageBySerial, p.typeId, p.unitId,
                                        p.status, p.createdBy, p.createdDate, p.updatedBy, p.updatedDate, u.unitName, u.shortName as shortNameUnit,
                                        t.typeName, t.typeCode, g.groupMaterialCode, g.groupMaterialName
                                        from tbl_Products as p
                                        join tbl_Units as u on p.unitId = u.unitId
                                        left join tbl_Types as t on p.typeId = t.typeId
                                        left join tbl_Serials as s on s.productId = p.productId
                                        left join tbl_Stocks as st on st.serialId = s.serialId
                                        left join tbl_GroupMaterials as g on p.groupMaterialId = g.groupMaterialId
                                        where (lower(p.productName) like BINARY ?) and st.placeId = ? and online=1
                                        ORDER BY p.productName
                                        limit 0, 20`;
        } else {
            queryStr = `select p.productId, p.productCode, p.productName,s.serial, IFNULL(st.quality,0) as inventory, p.groupMaterialId, p.manageBySerial, p.typeId, p.unitId,
                                        p.status, p.createdBy, p.createdDate, p.updatedBy, p.updatedDate, u.unitName, u.shortName as shortNameUnit,
                                        t.typeName, t.typeCode, g.groupMaterialCode, g.groupMaterialName
                                        from tbl_Products as p
                                        join tbl_Units as u on p.unitId = u.unitId
                                        left join tbl_Types as t on p.typeId = t.typeId
                                        left join tbl_Serials as s on s.productId = p.productId
                                        left join tbl_Stocks as st on st.serialId = s.serialId
                                        left join tbl_GroupMaterials as g on p.groupMaterialId = g.groupMaterialId
                                        where (lower(p.productName) like BINARY ?) and st.placeId = ?
                                        ORDER BY p.productName
                                        limit 0, 20`;
        }

        mysql.query(queryStr, [str, query.placeId], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get products failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: online ? resp : formatData(resp),
                    message: "Get products successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'products-controller',
            function: 'getProductsByNameCode',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get products failed!"
        };
        res.json(result);
    }
}


async function insertProduct(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const tables = _var.tables;
        const product = tables.products;
        const productColumns = product.columns;
        const user = await base.getSession(req);
        let conditions = {
            table: product.name,
            columns: {
                [productColumns.code]: body.code,
                [productColumns.name]: body.name,
                [productColumns.typeId]: body.typeId,
                [productColumns.groupMaterialId]: body.groupMaterialId,
                [productColumns.manageBySerial]: body.manageBySerial || null,
                [productColumns.unitId]: body.unitId,
                [productColumns.status]: body.status ? 1 : 0,
                [productColumns.online]: body.online ? 1 : 0,
                [productColumns.createdDate]: createdDate,
                [productColumns.createdBy]: user.userId,
            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi thêm Hàng Hóa!"
                };
            } else {
                conditions.columns.productId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Thêm Hàng Hóa thành công!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'products-controller',
            function: 'insertProduct',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi thêm Hàng Hóa"
        };
        res.json(result);
    }
}

async function updateProduct(req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.products;
        const tableName = table.name;
        const columns = table.columns;
        const updatedDate = new Date();
        const user = await base.getSession(req);

        let conditions = {
            table: tableName,
            columns: {
                [columns.code]: body.code,
                [columns.name]: body.name,
                [columns.typeId]: body.typeId,
                [columns.groupMaterialId]: body.groupMaterialId,
                [columns.manageBySerial]: body.manageBySerial,
                [columns.unitId]: body.unitId,
                [columns.status]: body.status ? 1 : 0,
                [columns.online]: body.online,
                [columns.updatedDate]: updatedDate,
                [columns.updatedBy]: user.userId,
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.productId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi sửa Hàng Hóa!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Sửa Hàng Hóa thành công!",
                    product: {
                        ...body,
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'products-controller',
            function: 'updateProduct',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi sửa Hàng Hóa!"
        };
        res.json(result);
    }
}

function deleteProduct(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.products;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.productId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi xóa Hàng Hóa!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Xóa Hàng Hóa thành công!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'products-controller',
            function: 'deleteProduct',
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

function getDeviceByDepartment(req, res) {
    const query = req.query;
    let result = {};
    try {
        let department = _var.department;
        const name = department[query.department];
        const promise1 = new Promise(resolve => {
            const strs = `SELECT * from tbl_${name}_Devices`;
            mysql.query(strs, null, resp => {
                let data = [];
                if (resp) {
                    data = resp;
                }
                resolve(data);
            })
        });
        const promise2 = new Promise(resolve => {
            const strs = `SELECT * from tbl_${name}_Parts`;
            mysql.query(strs, null, resp => {
                let data = [];
                if (resp) {
                    data = resp;
                }
                resolve(data);
            })
        });
        Promise.all([promise1, promise2]).then(resp => {
            result = {
                status: 200,
                data: {
                    devices: resp[0],
                    parts: resp[1]
                }
            };
            res.json(result);
        }).catch(error => {
            elk.error({
                controller: 'products-controller',
                function: 'getDeviceByDepartment',
                error: error,
                data: query
            });
            result = {
                status: 500,
                data: {
                    devices: [],
                    parts: []
                }
            };
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'products-controller',
            function: 'getDeviceByDepartment',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            data: {
                devices: [],
                parts: []
            }
        };
        res.json(result);
    }
}

function formatData(data) {
    let result = [];
    _.forEach(data, item => {
        const find = _.find(result, {productName: item.productName});
        if (find) {
            find.quality += item.quality;
        } else {
            result.push(item);
        }
    });
    return result;
}

module.exports = {
    getDeviceByDepartment,
    getAllProduct,
    getProductsByQuery,
    getProductsByNameCode,
    getProductsByName,
    getProducts,
    insertProduct,
    updateProduct,
    deleteProduct,
};