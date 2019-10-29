'use strict';
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');

function getInventoryMaterialsDetailed(req, res) {
    const query = req.query;
    let result = {};
    try {
        const reportOrder = JSON.parse(query.reportOrder);
        const pagination = {
            currentPage: query.currentPage ? parseInt(query.currentPage) : _var.pagination.currentPage,
            sizePage: query.sizePage ? parseInt(query.sizePage) : _var.pagination.sizePage,
        };
        const productId = reportOrder.productId;
        const placeId = reportOrder.placeId;
        const typeId = reportOrder.typeId;
        const groupMaterialId = reportOrder.groupMaterialId;
        const stateId = reportOrder.stateId;
        const strs = `SELECT pr.productCode, pr.productName, u.shortName, pl.placeName, s.stateName, n.miniumQuality
                    from tbl_Products as pr
                        join tbl_Units as u on pr.unitId = u.unitId
                        join tbl_NormOfProducts as n on pr.productId = n.productId
                        join tbl_Places as pl on n.placeId = pl.placeId
                        join tbl_States as s on n.stateId = s.stateId
                        where pl.placeId like  ?  and pr.productId like ? and s.stateId like ? and pr.typeId like ? and pr.groupMaterialId like ? 
                        limit ?, ?`;
        mysql.query(strs, [`%${placeId}%`, `%${productId}%`, `%${stateId}%`, `%${typeId}%`, `%${groupMaterialId}%`, pagination.currentPage * pagination.sizePage, pagination.sizePage], resp => {
            if (_.isNull(resp)) {
                result = {
                    status: 500,
                    data: {
                        data: []
                    },
                    message: "Lỗi lấy chi tiết xuất nhập tồn theo vật tư!"
                };
            } else {
                const conditions = `select count(productCode) as count from (
                    SELECT pr.productCode, pr.productName, u.shortName, pl.placeName, s.stateName, n.miniumQuality
                    from tbl_Products as pr
                        join tbl_Units as u on pr.unitId = u.unitId
                        join tbl_NormOfProducts as n on pr.productId = n.productId
                        join tbl_Places as pl on n.placeId = pl.placeId
                        join tbl_States as s on n.stateId = s.stateId 
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
                    message: "Lấy Chi tiết nhập xuất tồn theo vật tư thành công!"
                };
            }
            res.json(result);
        })
    } catch (err) {
        elk.error({
            controller: 'inventory-materials-detailed-controller',
            function: 'getInventoryMaterialsDetailed',
            error: err,
            data: query
        });
        result = {
            status: 500,
            message: "Get inventory materials detailed failed!"
        };
        res.json(result);
    }
}

module.exports = {
    getInventoryMaterialsDetailed
};