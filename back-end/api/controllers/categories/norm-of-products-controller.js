'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const base = require('../../base-controller');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllNormOfProduct(req, res) {
    let result = {};
    try {
        const query = `select * from tbl_NormOfProducts order by normOfProductName`;
        mysql.query(query, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get all normOfProduct failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get all normOfProduct successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'normOfProducts-controller',
            function: 'getAllNormOfProduct',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get all NormOfProduct failed!"
        };
        res.json(result);
    }
}

async function getNormOfProducts(req, res) {
    const query = req.query;
    let result = {};
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const tables = _var.tables;
        const normOfProducts = tables.normOfProducts;
        const normOfProductsColumns = normOfProducts.columns;
        const places = tables.places;
        const placeColumns = places.columns;
        const states = tables.states;
        const stateColumns = states.columns;
        const products = tables.products;
        const productsColumns = products.columns;
        const units = tables.units;
        const unitsColumn = units.columns;
        const conditions = {
            table: normOfProducts.name,
            order: {
                tables: normOfProducts.name,
                column: normOfProductsColumns.id,
                type: "ASC"
            },
            join: {
                join: [
                    {
                        table: places.name,
                        conditions: {
                            [normOfProducts.name]: normOfProductsColumns.placeId,
                            [places.name]: placeColumns.id
                        }
                    },
                    {
                        table: states.name,
                        conditions: {
                            [normOfProducts.name]: normOfProductsColumns.stateId,
                            [states.name]: stateColumns.id
                        }
                    },
                    {
                        table: products.name,
                        conditions: {
                            [normOfProducts.name]: normOfProductsColumns.productId,
                            [products.name]: productsColumns.id
                        }
                    },
                    {
                        table: units.name,
                        conditions: {
                            [products.name]: productsColumns.unitId,
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

        const getPlace = await new Promise(resolve => {
            const conditions1 = {
                table: places.name,
                order: {
                    tables: places.name,
                    column: placeColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions1, (resp) => {
                resolve(resp);
            })
        });

        const listPlace = getPlace.map((places) => {
            return {value: places.placeId.toString(), label: places.placeName}
        });

        const getState = await new Promise(resolve => {
            const conditions2 = {
                table: states.name,
                order: {
                    tables: states.name,
                    column: stateColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions2, (resp) => {
                resolve(resp);
            })
        });

        const listState = getState.map((states) => {
            return {value: states.stateId.toString(), label: states.stateName}
        });

        const getProduct = await new Promise(resolve => {
            const conditions3 = {
                table: products.name,
                order: {
                    tables: products.name,
                    column: productsColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions3, (resp) => {
                resolve(resp);
            })
        });

        const listProduct = getProduct.map((products) => {
            return {value: products.productId.toString(), label: products.productCode + " - " + products.productName}
        });

        const getUnit = await new Promise(resolve => {
            const conditions4 = {
                table: units.name,
                order: {
                    tables: units.name,
                    column: unitsColumn.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions4, (resp) => {
                resolve(resp);
            })
        });

        const listUnit = getUnit.map((units) => {
            return {value: units.unitId.toString(), label: units.unitName}
        });

        if (count === 0) {
            result = {
                status: 200,
                data: {
                    data: [],
                    listPlace: listPlace,
                    listState: listState,
                    listProduct: listProduct,
                    listUnit: listUnit,
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get normOfProducts successful!"
            };
        } else {
            // get groups by pagination
            const getNormOfProducts = await new Promise(resolve => {
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
                    data: getNormOfProducts,
                    listPlace: listPlace,
                    listState: listState,
                    listProduct: listProduct,
                    listUnit: listUnit,
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get normOfProducts successful!"
            };
        }
        res.json(result);
    } catch (error) {
        elk.error({
            controller: 'normOfProducts-controller',
            function: 'getNormOfProducts',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get NormOfProducts failed!"
        };
        res.json(result);
    }
}

async function insertNormOfProduct(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const tables = _var.tables;
        const normOfProducts = tables.normOfProducts;
        const normOfProductsColumns = normOfProducts.columns;
        const user = await base.getSession(req);
        let conditions = {
            table: normOfProducts.name,
            columns: {
                [normOfProductsColumns.miniumQuality]: body.miniumQuality,
                [normOfProductsColumns.desc]: body.desc,
                [normOfProductsColumns.placeId]: body.placeId,
                [normOfProductsColumns.stateId]: body.stateId,
                [normOfProductsColumns.productId]: body.productId,
                [normOfProductsColumns.createdDate]: createdDate,
                [normOfProductsColumns.createdBy]: user.userId,

            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi thêm định mức hàng hóa!"
                };
            } else {
                conditions.columns.normOfProductId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Thêm Định mức Hàng Hóa thành công!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'normOfProducts-controller',
            function: 'insertNormOfProduct',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi thêm định mức hàng hóa"
        };
        res.json(result);
    }
}

function updateNormOfProduct(req, res) {
    const body = req.body;
    let result = {};
    try {
        const updatedDate = new Date();
        const table = _var.tables.normOfProducts;
        const tableName = table.name;
        const columns = table.columns;
        const user = middleware.getUser(req);
        let conditions = {
            table: tableName,
            columns: {
                [columns.miniumQuality]: body.miniumQuality,
                [columns.desc]: body.desc,
                [columns.placeId]: body.placeId,
                [columns.stateId]: body.stateId,
                [columns.productId]: body.productId,
                [columns.updatedDate]: updatedDate,
                [columns.updatedBy]: user.userId || 16,
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.normOfProductId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi sửa Định mức hàng hóa!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Sửa định mức hàng hóa thành công!",
                    normOfProducts: {
                        ...body,
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'normOfProducts-controller',
            function: 'updateNormOfProduct',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi sửa định mức hàng hóa!"
        };
        res.json(result);
    }
}

function deleteNormOfProduct(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.normOfProducts;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.normOfProductId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi xóa định mức hàng hóa!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Xóa định mức hàng hóa thành công!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'normOfProducts-controller',
            function: 'deleteNormOfProduct',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Lỗi xóa định mức hàng hóa!"
        };
        res.json(result);
    }
}


module.exports = {
    getAllNormOfProduct,
    getNormOfProducts,
    insertNormOfProduct,
    updateNormOfProduct,
    deleteNormOfProduct,
};