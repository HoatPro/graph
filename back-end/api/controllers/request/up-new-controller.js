'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');

function getContract(req, res) {
    const query = req.query;
    let result = [];
    try {
        const tables = _var.tables;
        const contracts = tables.contracts;
        const contractColumns = contracts.columns;
        const conditions = {
            table: contracts.name,
            order: {
                column: contractColumns.createdDate,
                type: "DESC"
            },
            where: {
                and: [{
                    column: `${contracts.name}.${contractColumns.id}`,
                    value: query.contractId.toLocaleUpperCase(),
                    compare: '='
                }]
            }
        };

        mysql.search(conditions, (resp) => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = temp;
            res.json(result);
        });
    } catch (error) {
        elk.error({
            function: 'getContract',
            controller: 'up-new-controller',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        // console.error('getContract_up-new-controller', { error: err, data: {} });
        res.json(result);
    }
}

function getDevicesByContract(req, res) {
    const query = req.query;
    let result = [];
    try {
        const tables = _var.tables;
        const contracts = tables.contracts;
        const contractColumns = contracts.columns;
        const devices = tables.devices;
        const deviceColumns = devices.columns;
        const racks = tables.racks;
        const racksColumns = racks.columns;
        const deviceTemplates = tables.deviceTemplates;
        const deviceTemplateColumns = deviceTemplates.columns;
        const deviceTypes = tables.deviceTypes;
        const deviceTypeColumns = deviceTypes.columns;
        const conditions = {
            table: devices.name,
            select: [
                {
                    table: contracts.name,
                    columns: [
                        {name: contractColumns.id},
                        {name: contractColumns.name},
                        {name: contractColumns.barcode},
                        {name: contractColumns.fullName},
                        {name: contractColumns.company},
                        {name: contractColumns.phone},
                        {name: contractColumns.startDate},
                        {name: contractColumns.endDate},
                    ]
                },
                {
                    table: devices.name,
                    columns: [
                        {name: deviceColumns.id},
                        {name: deviceColumns.name},
                        {name: deviceColumns.label},
                        {name: deviceColumns.deviceTemplateId},
                        {name: deviceColumns.connectorNumber},
                        {name: deviceColumns.status, as: 'deviceStatus'},
                        {name: deviceColumns.IP},
                        {name: deviceColumns.createdBy},
                        {name: deviceColumns.position},
                        {name: deviceColumns.positionU},
                        {name: deviceColumns.endPositionU},
                        {name: deviceColumns.rackId},
                    ]
                },
                {
                    table: racks.name,
                    columns: [
                        {name: racksColumns.name},
                    ]
                },
                {
                    table: deviceTemplates.name,
                    columns: [
                        {name: deviceTemplateColumns.name},
                        {name: deviceTemplateColumns.deviceTypeId},
                    ]
                },
                {
                    table: deviceTypes.name,
                    columns: [
                        {name: deviceTypeColumns.name},
                    ]
                }
            ],
            join: {
                join: [
                    {
                        table: contracts.name,
                        conditions: {[contracts.name]: contractColumns.id, [devices.name]: deviceColumns.contractId}
                    },
                    {
                        table: racks.name,
                        conditions: {[racks.name]: racksColumns.id, [devices.name]: deviceColumns.rackId}
                    },
                    {
                        table: deviceTemplates.name,
                        conditions: {
                            [deviceTemplates.name]: deviceTemplateColumns.id,
                            [devices.name]: deviceColumns.deviceTemplateId
                        }
                    },
                    {
                        table: deviceTypes.name,
                        conditions: {
                            [deviceTypes.name]: deviceTypeColumns.id,
                            [deviceTemplates.name]: deviceTemplateColumns.deviceTypeId
                        }
                    },
                ]
            },
            order: {
                column: contractColumns.createdDate,
                type: "DESC"
            },
            where: {
                and: [{
                    column: `${contracts.name}.${contractColumns.id}`,
                    value: query.contractId.toLocaleUpperCase(),
                    compare: '='
                }]
            }
        };

        mysql.search(conditions, (resp) => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = resp;
            }
            result = temp;
            res.json(result);
        });
    } catch (error) {
        elk.error({
            function: 'getDevicesByContract',
            controller: 'up-new-controller',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        // console.error('getDevicesByContract_up-new-controller', { error: err, data: {} });
        res.json(result);
    }
}

module.exports = {
    getContract,
    getDevicesByContract
};