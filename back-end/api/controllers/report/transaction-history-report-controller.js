'use strict';
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');

function getTransactionHistoryReport(req, res) {
    const query = req.query;
    let result = {};
    try {
        const reportOrder = JSON.parse(query.reportOrder);
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const numberOfVoucher = reportOrder.numberOfVoucher;
        const stockDelivering = reportOrder.stockDelivering;
        const stockReceiving = reportOrder.stockReceiving;
        const productId = reportOrder.productId;
        const stateDelivering = reportOrder.stateDelivering;
        const stateReceiving = reportOrder.stateReceiving;
        const serialId = reportOrder.serialId;
        const reasonId = reportOrder.reasonId;
        const strs = `SELECT o.orderId, voucher as numberOfVoucher, stockReceiving, pl.placeName as stockDelivering, o.createdBy, o.createdDate, o.reasonId, rs.reasonName, od.productId, pr.productCode, pr.productName, u.shortName, quality, od.description, serial, placeName,b.branchName  
                     FROM tbl_Orders as o
                        join tbl_Reasons as rs on rs.reasonId = o.reasonId
                        join tbl_Places as pl on o.stockDelivering = pl.placeId
                        join tbl_Users on o.createdBy = tbl_Users.userId 
                        join tbl_OrderDetails as od on od.orderId = o.orderId
                        join tbl_Products as pr on pr.productId = od.productId
                        join tbl_Units as u on pr.unitId = u.unitId
                        join tbl_Branchs as b on pl.branchId = b.branchId
                        where voucher like ? and stockDelivering like ? and pr.productId like ? and rs.reasonId like ? 
                    limit ?, ?`;
        mysql.query(strs, [`%${numberOfVoucher}%`, `%${stockDelivering}%`, `%${productId}%`, `%${reasonId}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: {
                        data: []
                    },
                    message: "Lỗi lấy báo cáo lịch sử giao dịch!"
                };
            } else {
                const conditions = `select count(orderId) as count from (
                    SELECT o.orderId, voucher as numberOfVoucher, stockReceiving, pl.placeName as stockDelivering, o.createdBy, o.createdDate, o.reasonId, rs.reasonName, od.productId, pr.productCode, pr.productName, u.shortName, quality, od.description, serial, placeName,b.branchName
                     FROM tbl_Orders as o
                        join tbl_Reasons as rs on rs.reasonId = o.reasonId
                        join tbl_Places as pl on o.stockDelivering = pl.placeId
                        join tbl_Users on o.createdBy = tbl_Users.userId 
                        join tbl_OrderDetails as od on od.orderId = o.orderId
                        join tbl_Products as pr on pr.productId = od.productId
                        join tbl_Units as u on pr.unitId = u.unitId
                        join tbl_Branchs as b on pl.branchId = b.branchId
                        where voucher like ? and stockDelivering like ? and pr.productId like ? and rs.reasonId like ? 
                    limit ?, ?)as t`;
                const count = new Promise(resolve => {
                    mysql.query(conditions, [`%${numberOfVoucher}%`, `%${stockDelivering}%`, `%${productId}%`, `%${reasonId}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
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
                    message: "Lấy báo cáo lịch sử giao dịch thành công!"
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
    getTransactionHistoryReport,
};