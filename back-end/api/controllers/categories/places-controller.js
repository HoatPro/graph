'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getAllPlace(req, res) {
    let result = {};
    try {
        const query = `select * from tbl_Places order by placeName`;
        mysql.query(query, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get all place failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get all place successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'places-controller',
            function: 'getAllPlace',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: []
        });
        result = {
            status: 500,
            message: "Get all Place failed!"
        };
        res.json(result);
    }
}

async function getPlaces(req, res) {
    const query = req.query;
    let result = {};
    try {
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const tables = _var.tables;
        const places = tables.places;
        const placesColumns = places.columns;
        const districts = tables.districts;
        const districtsColumns = districts.columns;
        const branchs = tables.branchs;
        const branchsColumns = branchs.columns;
        const users = tables.users;
        const usersColumns = users.columns;
        const departments = tables.departments;
        const departmentsColumns = departments.columns;
        const states = tables.states;
        const statesColumns = states.columns;
        const conditions = {
            table: places.name,
            order: {
                tables: places.name,
                column: placesColumns.id,
                type: "ASC"
            },
            join: {
                join: [
                    {
                        table: districts.name,
                        conditions: {
                            [places.name]: placesColumns.districtId,
                            [districts.name]: districtsColumns.id
                        }
                    },
                    {
                        table: branchs.name,
                        conditions: {
                            [places.name]: placesColumns.branchId,
                            [branchs.name]: branchsColumns.id
                        }
                    },
                    {
                        table: departments.name,
                        conditions: {
                            [places.name]: placesColumns.departmentId,
                            [departments.name]: departmentsColumns.id
                        }
                    },
                    {
                        table: users.name,
                        conditions: {
                            [places.name]: placesColumns.stockKeeper,
                            [users.name]: usersColumns.id
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

        const getDepartment = await new Promise(resolve => {
            const conditions2 = {
                table: departments.name,
                order: {
                    tables: departments.name,
                    column: departmentsColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions2, (resp) => {
                resolve(resp);
            })
        });

        const listDepartment = getDepartment.map((departments) => {
            return {value: departments.departmentId.toString(), label: departments.departmentName}
        });

        const getBranch = await new Promise(resolve => {
            const conditions2 = {
                table: branchs.name,
                order: {
                    tables: branchs.name,
                    column: branchsColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions2, (resp) => {
                resolve(resp);
            })
        });

        const listBranch = getBranch.map((branchs) => {
            return {value: branchs.branchId.toString(), label: branchs.branchName}
        });

        const getDistrict = await new Promise(resolve => {
            const conditions2 = {
                table: districts.name,
                order: {
                    tables: districts.name,
                    column: districtsColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions2, (resp) => {
                resolve(resp);
            })
        });

        const listDistrict = getDistrict.map((districts) => {
            return {value: districts.districtId.toString(), label: districts.districtName}
        });

        const getState = await new Promise(resolve => {
            const conditions4 = {
                table: states.name,
                order: {
                    tables: states.name,
                    column: statesColumns.id,
                    type: "ASC"
                },
            };
            mysql.search(conditions4, (resp) => {
                resolve(resp);
            })
        });

        const getStockKipper = await new Promise(resolve => {
            const queryStr = `select userId, username, email, fullName from tbl_Users where type = 2 order by fullName`;
            mysql.query(queryStr, null, resp => {
                let data = [];
                if (!_.isNull(resp)) {
                    data = resp;
                }
                resolve(data);
            })
        });

        const listState = getState.map((states) => {
            return {value: states.stateId.toString(), label: states.stateName}
        });

        if (count === 0) {
            result = {
                status: 200,
                data: {
                    data: [],
                    listDepartment: listDepartment,
                    listBranch: listBranch,
                    listDistrict: listDistrict,
                    listState: listState,
                    stockKeeper: getStockKipper
                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get places successful!"
            };
        } else {
            // get groups by pagination
            const getPlaces = await new Promise(resolve => {
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
                    data: getPlaces,
                    listDepartment: listDepartment,
                    listBranch: listBranch,
                    listDistrict: listDistrict,
                    listState: listState,
                    stockKeeper: getStockKipper

                },
                pagination: {
                    currentPage: pagination.currentPage,
                    countPage: countPage,
                    sizePage: pagination.sizePage
                },
                message: "Get places successful!"
            };
        }
        res.json(result);
    } catch (error) {
        elk.error({
            controller: 'places-controller',
            function: 'getPlaces',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Get Places failed!"
        };
        res.json(result);
    }
}

async function insertPlace(req, res) {
    const body = req.body;
    let result = {};
    try {
        const createdDate = new Date();
        const tables = _var.tables;
        const places = tables.places;
        const placesColumns = places.columns;
        let conditions = {
            table: places.name,
            columns: {
                [placesColumns.code]: body.code,
                [placesColumns.name]: body.name,
                [placesColumns.address]: body.address,
                [placesColumns.shortName]: body.shortName,
                [placesColumns.desc]: body.desc,
                [placesColumns.districtId]: body.districtId,
                [placesColumns.branchId]: body.branchId,
                [placesColumns.departmentId]: body.departmentId,
                [placesColumns.stockKeeper]: body.stockKeeper || 16,
                [placesColumns.status]: body.status ? 1 : 0,
                [placesColumns.main]: body.main ? 1 : 0,
            }
        };
        mysql.insert(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi thêm Chi Nhánh!"
                };
            } else {
                conditions.columns.placeId = resp.data.insertId;
                result = {
                    status: 200,
                    message: "Thêm Chi Nhánh thành công!",
                    data: conditions.columns
                };
            }
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'places-controller',
            function: 'insertPlace',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi thêm Chi Nhánh"
        };
        res.json(result);
    }
}

async function updatePlace(req, res) {
    const body = req.body;
    let result = {};
    try {
        const tables = _var.tables;
        const places = tables.places;
        const placesColumns = places.columns;
        const placeDetails = tables.placeDetails;
        const placeDetailsColumns = placeDetails.columns;

        let conditions = {
            table: places.name,
            columns: {
                [placesColumns.code]: body.code,
                [placesColumns.name]: body.name,
                [placesColumns.address]: body.address,
                [placesColumns.shortName]: body.shortName,
                [placesColumns.desc]: body.desc,
                // [columns.districtId]: body.districtId,
                [placesColumns.branchId]: body.branchId,
                [placesColumns.departmentId]: body.departmentId,
                [placesColumns.stockKeeper]: body.stockKeeper || 16,
                [placesColumns.status]: body.status ? 1 : 0,
                [placesColumns.main]: body.main ? 1 : 0,
            },
            where: {
                and: [
                    {column: `${places.name}.${placesColumns.id}`, value: body.placeId, compare: '='}
                ]
            }
        };
        const place = await new Promise(resolve => {
            mysql.update(conditions, resp => {
                resolve(resp);
            });
        });
        if (_.isNull(place.data)) {
            result = {
                status: 500,
                message: place.message ? place.message : "Lỗi sửa Chi Nhánh!"
            };
            res.json(result);
        } else {
            const states = body.states;
            if (_.size(states) > 0) {
                const insert = states.insert;
                const _delete = states.delete;
                let promises = [];
                if (_.size(insert) > 0) {
                    const values = _.map(insert, value => [body.placeId, value]);
                    const conditionsOthers = {
                        table: placeDetails.name,
                        columns: [
                            [placeDetailsColumns.placeId],
                            [placeDetailsColumns.stateId],
                        ],
                        values: values
                    };
                    const promise = new Promise(resolve => {
                        mysql.insertMulti(conditionsOthers, respOthers => {
                            resolve(respOthers);
                        });
                    });
                    promises.push(promise);
                }
                if (_.size(_delete) > 0) {
                    const values = _.map(_delete, item => {
                        return {
                            column: `${placeDetails.name}.${placeDetailsColumns.stateId}`,
                            value: item,
                            compare: '='
                        }
                    });
                    const conditionsOthers = {
                        table: placeDetails.name,
                        where: {
                            and: [
                                {
                                    column: `${placeDetails.name}.${placeDetailsColumns.placeId}`,
                                    value: body.placeId,
                                    compare: '='
                                }
                            ],
                            or: [
                                ...values
                            ]
                        },
                    };
                    const promise = new Promise(resolve => {
                        mysql.delete(conditionsOthers, respOthers => {
                            resolve(respOthers);
                        });
                    });
                    promises.push(promise);
                }

                Promise.all(promises).then(resp => {
                    let flag = false;
                    _.forEach(resp, item => {
                        if (_.isNull(item)) {
                            flag = true;
                        }
                    });

                    if (flag) {
                        result = {
                            status: 500,
                            message: "Sửa Địa điểm lỗi!",
                        };
                    } else {
                        result = {
                            status: 200,
                            message: "Sửa Địa điểm thành công!",
                            data: {
                                ...body,
                                updatedDate: updatedDate
                            }
                        };
                    }
                    res.json(result);
                })
            } else {
                result = {
                    status: 200,
                    message: "Sửa Địa điểm thành công!",
                    data: {
                        ...body,
                        updatedDate: updatedDate
                    }
                };
                res.json(result);
            }
        }
    } catch (error) {
        elk.error({
            controller: 'places-controller',
            function: 'updatePlace',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Lỗi sửa Chi Nhánh!"
        };
        res.json(result);
    }
}

function deletePlace(req, res) {
    const query = req.query;
    let result = {};
    try {
        const table = _var.tables.places;
        const tableName = table.name;
        const columns = table.columns;
        const conditions = {
            table: tableName,
            where: {
                and: [
                    {column: `${tableName}.${columns.id}`, value: query.placeId, compare: '='}
                ]
            }
        };

        mysql.delete(conditions, resp => {
            if (_.isNull(resp.data)) {
                result = {
                    status: 500,
                    message: resp.message ? resp.message : "Lỗi xóa Chi Nhánh!"
                };
            } else {
                result = {
                    status: 200,
                    message: "Xóa Chi Nhánh thành công!",
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'places-controller',
            function: 'deletePlace',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "Lỗi xóa Chi Nhánh!"
        };
        res.json(result);
    }
}


module.exports = {
    getAllPlace,
    getPlaces,
    insertPlace,
    updatePlace,
    deletePlace,
};