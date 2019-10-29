'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllDistrict(req, res) {
    let result = {};
    try {
        const query = `select * from tbl_Districts order by districtId`;
        mysql.query(query, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: {
                        data: []
                    },
                    message: "Get all district failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: {
                        data: resp
                    },
                    message: "Get all district successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'districts-controller',
            function: 'getAllDistrict',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get all District failed!"
        };
        res.json(result);
    }
}

async function getDistricts(req, res) {
    const query = req.query;
    let result = {};
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const tables = _var.tables;
        const districts = tables.districts;
        const districtsColumns = districts.columns;
        const provinces = tables.provinces;
        const provincesColumns = provinces.columns;
        const conditions = {
            table: districts.name,
            order: {
                tables: districts.name,
                column: districtsColumns.id,
                type: "ASC"
            },
            join: {
                join: [
                    {
                        table: provinces.name,
                        conditions: {
                            [districts.name]: districtsColumns.provinceId,
                            [provinces.name]: provincesColumns.id
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

        const getProvince = await new Promise(resolve => {
            const conditions2 = {
                table: provinces.name,
                order: {
                    tables: provinces.name,
                    column: provincesColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions2, (resp) => {
                resolve(resp);
            })
        });

        const listProvince = getProvince.map((provinces) => {
            return {value: provinces.provinceId.toString(), label: provinces.provinceName}
        });

        if (count === 0) {
            result = {
                status: 200,
                data: {
                    data: [],
                    listProvince: listProvince
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get districts successful!"
            };
        } else {
            // get groups by pagination
            const getDistricts = await new Promise(resolve => {
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
                    data: getDistricts,
                    listProvince: listProvince
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get districts successful!"
            };
        }
        res.json(result);
    } catch (error) {
        elk.error({
            controller: 'districts-controller',
            function: 'getDistricts',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Districts failed!"
        };
        res.json(result);
    }
}

async function insertDistrict(req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const districts = tables.districts;
        const districtsColumns = districts.columns;
        let conditions = {
            table: districts.name,
            columns: {
                [districtsColumns.name]: body.name,
                [districtsColumns.provinceId]: body.provinceId,
            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi thêm Quận!"
                };
            } else {
                conditions.columns.districtId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Thêm Quận thành công!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'districts-controller',
            function: 'insertDistrict',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi thêm Quận"
        };
        res.json(result);
    }
}

function updateDistrict(req, res) {
    const body = req.body;
    let result = {};
    try {
        const table = _var.tables.districts;
        const tableName = table.name;
        const columns = table.columns;

        let conditions = {
            table: tableName,
            columns: {
                [columns.name]: body.name,
                [columns.provinceId]: body.provinceId,
            },
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: body.districtId, compare: '='}
                ]
            }
        };

        mysql.update(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi sửa Quận!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Sửa Quận thành công!",
                    districts: {
                        ...body,
                    }
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'districts-controller',
            function: 'updateDistrict',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi sửa Quận!"
        };
        res.json(result);
    }
}

function deleteDistrict(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.districts;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.districtId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi xóa Quận!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Xóa Quận thành công!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'districts-controller',
            function: 'deleteDistrict',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Lỗi xóa Quận!"
        };
        res.json(result);
    }
}

async function searchDistrict(req, res) {
    const query = req.query;
    let result = {};
    try {
        const _pagination = JSON.parse(query.pagination);
        const search = JSON.parse(query.search);
        const pagination = {
            currentPage: _pagination.currentPage ? parseInt(_pagination.currentPage) : _var.pagination.currentPage,
            sizePage: _pagination.sizePage ? parseInt(_pagination.sizePage) : _var.pagination.sizePage,
        };
        const name = search.name;

        const conditions = `select count(districtId) as count from (
                            SELECT * FROM tbl_Districts 
                            WHERE tbl_Districts.districtName LIKE ?
                            GROUP BY tbl_Districts.districtId)as t`;
        const count = await new Promise(resolve => {
            mysql.query(conditions, [`%${name}%`], resp => {
                let result = 0;
                if (resp) {
                    result = resp[0].count;
                }
                resolve(result);
            })
        });

        const countPage = ~~((count - 1) / pagination.sizePage) + 1;
        if (count === 0) {
            result = {
                status: 200,
                data: [],
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get districts successful!"
            };
        } else {
            const respDistricts = await new Promise(resolve => {
                const queryStr = `SELECT * FROM tbl_Districts 
                                 WHERE tbl_Districts.districtName LIKE ?
                                 order by districtId LIMIT ?,?`;
                mysql.query(queryStr, [`%${name}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
                    resolve(resp);
                });
            });
            if (_.size(respDistricts) > 0) {
                result = {
                    status: 200,
                    data: respDistricts,
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                    message: "Get districts successful!"
                };
            } else {
                result = {
                    status: 200,
                    data: [],
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                    message: "Get districts successful!"
                };
            }
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'districts-controller',
            function: 'searchDistrict',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Search District failed!"
        };
        res.json(result);
    }
}

function genarateValues(data) {
    // const createdDate = new Date();
    const tables = _var.tables;
    const districts = tables.districts;
    const districtsColumns = districts.columns;
    const getDistricts = new Promise(resolve => {
        const conditions1 = {
            table: districts.name,
            order: {
                tables: districts.name,
                column: districtsColumns.id,
                type: "ASC"
            },
        };
        mysql.search(conditions1, (resp) => {
            resolve(resp);
        })
    });

    const data1 = getDistricts.map((districts) => {
        return [districts.districtId, districts.provinceId, districts.districtName]
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

async function importDistrict(req, res) {
    let result = {};
    try {
        const data = req.body;
        /*
        *  insert multiple rows
        * data: {table: table_name, columns: [column1, columns2], values: [[value1, value2], [value1`, value2`]] }
        */
        const districts = _var.tables.districts;
        const columns = districts.columns;

        let conditions = {
            table: districts.name,
            columns: [
                columns.id,
                columns.provinceId,
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
            controller: 'districts-controller',
            function: 'importDistrict',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Lỗi import Quận/Huyện!"
        };
        res.json(result);
    }
}

module.exports = {
    getAllDistrict,
    getDistricts,
    insertDistrict,
    updateDistrict,
    deleteDistrict,
    searchDistrict,
    importDistrict,
};