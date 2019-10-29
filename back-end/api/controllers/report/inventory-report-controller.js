'use strict';
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');

function getInventoryReport(req, res) {
    const query = req.query;
    let result = {};
    try {
        const reportOrder = JSON.parse(query.reportOrder);
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const placeId = reportOrder.placeId;
        const productId = reportOrder.productId;
        const stateId = reportOrder.stateId;
        const groupMaterialId = reportOrder.groupMaterialId;
        const transactionDate = reportOrder.transactionDate;
        const typeId = reportOrder.typeId;
        const strs = `SELECT pr.productCode, pr.productName, u.shortName, b.branchName, pl.placeName, s.stateName, n.miniumQuality, st.quality
                    from tbl_Products as pr
                        join tbl_Units as u on pr.unitId = u.unitId
                        join tbl_NormOfProducts as n on pr.productId = n.productId
                        join tbl_Places as pl on n.placeId = pl.placeId
                        join tbl_Branchs as b on pl.branchId = b.branchId
                        join tbl_States as s on n.stateId = s.stateId
                        join tbl_Serials as se on pr.productId = se.productId
                        join tbl_Stocks as st on se.serialId = st.serialId                        
                        where pl.placeId like  ?  and pr.productId like ? and s.stateId like ? and pr.typeId like ? and pr.groupMaterialId like ? 
                        limit ?, ?`;
        mysql.query(strs, [`%${placeId}%`, `%${productId}%`, `%${stateId}%`, `%${typeId}%`, `%${groupMaterialId}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: {
                        data: []
                    },
                    message: "Lỗi lấy báo cáo tổng hợp hàng tồn!"
                };
            } else {
                const conditions = `select count(productCode) as count from (
                    SELECT pr.productCode, pr.productName, u.shortName, b.branchName, pl.placeName, s.stateName, n.miniumQuality, st.quality
                    from tbl_Products as pr
                        join tbl_Units as u on pr.unitId = u.unitId
                        join tbl_NormOfProducts as n on pr.productId = n.productId
                        join tbl_Places as pl on n.placeId = pl.placeId
                        join tbl_Branchs as b on pl.branchId = b.branchId
                        join tbl_States as s on n.stateId = s.stateId 
                        join tbl_Serials as se on pr.productId = se.productId
                        join tbl_Stocks as st on se.serialId = st.serialId
                        where pl.placeId like ? and pr.productId like ? and s.stateId like ? and pr.typeId like ? and pr.groupMaterialId like ? 
                        limit ?, ?)as t`;
                const count = new Promise(resolve => {
                    mysql.query(conditions, [`%${placeId}%`, `%${productId}%`, `%${stateId}%`, `%${typeId}%`, `%${groupMaterialId}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
                        let result = 0;
                        if (resp) {
                            result = resp[0].count;
                        }
                        resolve(result);
                    })
                });

                const countPage = ~~((count - 1) / pagination.sizePage) + 1;
                result = {
                    status: 200,
                    data: {
                        data: resp
                    },
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                    message: "Lấy báo cáo tổng hợp hàng tồn thành công!"
                };
            }
            res.json(result);
        })
    } catch (err) {
        elk.error({
            controller: 'inventory-report-controller',
            function: 'getInventoryReport',
            error: err,
            data: query
        });
        result = {
            status: 500,
            message: "Get groups failed!"
        };
        res.json(result);
    }
}

function getSerials(req, res) {
    let result = {};
    try {
        const queryStr = `SELECT * FROM tbl_Serials
                        where serial like "%%"
                        order by productId`;
        mysql.query(queryStr, null, resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: [],
                    message: "Get all serials failed!"
                };
            } else {
                result = {
                    status: 200,
                    data: resp,
                    message: "Get all serials successful!"
                };
            }
            res.json(result);
        })
    } catch (error) {
        elk.error({
            controller: 'inventory-report-controller',
            function: 'getSerials',
            error: error,
            data: []
        });
        result = {
            status: 500,
            message: "Get all serials failed!"
        };
        res.json(result);
    }
}

function getInventoryReportBySerial(req, res) {
    const query = req.query;
    let result = {};
    try {
        const reportOrder = JSON.parse(query.reportOrder);
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const placeId = reportOrder.placeId;
        const productId = reportOrder.productId;
        const stateId = reportOrder.stateId;
        const groupMaterialId = reportOrder.groupMaterialId;
        const transactionDate = reportOrder.transactionDate;
        const typeId = reportOrder.typeId;
        const serialId = reportOrder.serialId;
        const strs = `SELECT pr.productCode, pr.productName, se.serial, u.shortName, b.branchName, pl.placeName, s.stateName, n.miniumQuality, st.quality
                    from tbl_Products as pr
                        join tbl_Units as u on pr.unitId = u.unitId
                        join tbl_NormOfProducts as n on pr.productId = n.productId
                        join tbl_Places as pl on n.placeId = pl.placeId
                        join tbl_Branchs as b on pl.branchId = b.branchId
                        join tbl_States as s on n.stateId = s.stateId
                        join tbl_Serials as se on pr.productId = se.productId
                        join tbl_Stocks as st on se.serialId = st.serialId                        
                        where pl.placeId like  ?  and pr.productId like ? and s.stateId like ? and se.serial like ? and pr.typeId like ? and pr.groupMaterialId like ?
                        limit ?, ?`;
        mysql.query(strs, [`%${placeId}%`, `%${productId}%`, `%${stateId}%`, `%${serialId}%`, `%${typeId}%`, `%${groupMaterialId}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: {
                        data: []
                    },
                    message: "Lỗi lấy báo cáo tổng hợp hàng tồn theo serial!"
                };
            } else {
                const conditions = `select count(productCode) as count from (
                    SELECT pr.productCode, pr.productName, se.serial , u.shortName, b.branchName, pl.placeName, s.stateName, n.miniumQuality, st.quality
                    from tbl_Products as pr
                        join tbl_Units as u on pr.unitId = u.unitId
                        join tbl_NormOfProducts as n on pr.productId = n.productId
                        join tbl_Places as pl on n.placeId = pl.placeId
                        join tbl_Branchs as b on pl.branchId = b.branchId
                        join tbl_States as s on n.stateId = s.stateId 
                        join tbl_Serials as se on pr.productId = se.productId
                        join tbl_Stocks as st on se.serialId = st.serialId                        
                        where pl.placeId like ? and pr.productId like ? and s.stateId like ? and se.serial like ? and pr.typeId like ? and pr.groupMaterialId like ?
                        limit ?, ?)as t`;
                const count = new Promise(resolve => {
                    mysql.query(conditions, [`%${placeId}%`, `%${productId}%`, `%${stateId}%`, `%${serialId}%`, `%${typeId}%`, `%${groupMaterialId}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
                        let result = 0;
                        if (resp) {
                            result = resp[0].count;
                        }
                        resolve(result);
                    })
                });

                const countPage = ~~((count - 1) / pagination.sizePage) + 1;
                result = {
                    status: 200,
                    data: {
                        data: resp
                    },
                    pagination: {
                        currentPage: pagination.currentPage,
                        countPage: countPage,
                        sizePage: pagination.sizePage
                    },
                    message: "Lấy báo cáo tổng hợp hàng tồn theo serial thành công!"
                };
            }
            res.json(result);
        })
    } catch (err) {
        elk.error({
            controller: 'inventory-report-controller',
            function: 'getInventoryReport',
            error: err,
            data: query
        });
        result = {
            status: 500,
            message: "Get groups failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getInventoryReport,
    getInventoryReportBySerial,
    getSerials,
};