'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllProvince(req, res) {
    let result = {};
    try {
        const query = `select * from tbl_Provinces order by provinceId`;
        mysql.query(query, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: {
                        data: []
                    },
                    message: "Get all province failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: {
                        data: resp
                    },
                    message: "Get all province successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'provinces-controller',
            function: 'getAllProvince',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get all Province failed!"
        };
        res.json(result);
    }
}

async function getProvinces(req, res) {
    const query = req.query;
    let result = {};
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const tables = _var.tables;
        const provinces = tables.provinces;
        const provincesColumns = provinces.columns;
        const conditions = {
            table: provinces.name,
            order: {
                tables: provinces.name,
                column: provincesColumns.id,
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
                data: {
                    data: []
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get provinces successful!"
            };
        } else {
            // get groups by pagination
            const getProvinces = await new Promise(resolve => {
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
                    data: getProvinces
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get provinces successful!"
            };
        }
        res.json(result);
    } catch (error) {
        elk.error({
            controller: 'provinces-controller',
            function: 'getProvinces',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Provinces failed!"
        };
        res.json(result);
    }
}

async function insertProvince(req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const province = tables.provinces;
        const provincesColumns = province.columns;
        let conditions = {
            table: province.name,
            columns: {
                [provincesColumns.name]: body.name,
            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi thêm Tỉnh/Thành Phố!"
                };
            } else {
                conditions.columns.placeId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Thêm Tỉnh/Thành Phố thành công!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'provinces-controller',
            function: 'insertProvince',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi thêm Tỉnh/Thành Phố"
        };
        res.json(result);
    }
}

function updateProvince(req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.provinces;
        const tableName = table.name;
        const columns = table.columns;

        let conditions = {
            table: tableName,
            columns: {
                [columns.name]: body.name,
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.provinceId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi sửa Tỉnh/Thành Phố!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Sửa Tỉnh/Thành Phố thành công!",
                    places: {
                        ...body,
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'provinces-controller',
            function: 'updateProvince',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi sửa Tỉnh/THành Phố!"
        };
        res.json(result);
    }
}

function deleteProvince(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.provinces;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.provinceId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi xóa Tỉnh/Thành Phố!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Xóa Tỉnh/Thành Phố thành công!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'provinces-controller',
            function: 'deleteProvince',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Lỗi xóa Tỉnh/Thành Phố!"
        };
        res.json(result);
    }
}

async function genarateValues(data) {
    // const createdDate = new Date();
    const tables = _var.tables;
    const provinces = tables.provinces;
    const provincesColumns = provinces.columns;
    const getProvinces = await new Promise(resolve => {
        const conditions1 = {
            table: provinces.name,
            order: {
                tables: provinces.name,
                column: provincesColumns.id,
                type: "ASC"
            },
        };
        mysql.search(conditions1, (resp) => {
            resolve(resp);
        })
    });

    const data1 = getProvinces.map((provinces) => {
        return [provinces.provinceId, provinces.provinceName]
    });
    console.log("data", data1);

    let values = data.map(row => {
        let temp = [...row];
        // temp.shift();
        // temp.push(createdDate);
        return temp;
    });
    values.shift();
    // values.pop();
    console.log("ex", values);

    const diff = _.differenceWith(values, data1, _.isEqual);
    console.log("diff", diff);
    console.log(_.size(diff));
    if (_.size(diff) > 0) {
        values = diff;
    } else {
        values = [];
    }
    console.log("valuebefore", values);

    return values;
}

async function importProvince(req, res) {
    let result = {};
    try {
        const data = req.body;
        /*
        *  insert multiple rows
        * data: {table: table_name, columns: [column1, columns2], values: [[value1, value2], [value1`, value2`]] }
        */
        const provinces = _var.tables.provinces;
        const columns = provinces.columns;

        let conditions = {
            table: provinces.name,
            columns: [
                columns.id,
                columns.name,
            ],
            values: await genarateValues(data)
        };
        mysql.insertMulti(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Import failed!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Import successful!"
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'provinces-controller',
            function: 'importProvince',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Lỗi import Tỉnh/Thành Phố!"
        };
        res.json(result);
    }
}

module.exports = {
    getProvinces,
    getAllProvince,
    insertProvince,
    updateProvince,
    deleteProvince,
    importProvince,
};