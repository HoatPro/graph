'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const type = _var.logConfig.type;
const base = require('../../base-controller');
const request = require('request');
const surveyController = require('./survey-device-controller');

async function getDeploymentDevice(req, res) {
    const query = req.query;
    let result = {};
    try {
        const connection = await mysql.transaction();
        const _pagination = query.pagination ? JSON.parse(query.pagination) : {};
        const search = query.search ? JSON.parse(query.search) : {};
        const pagination = {
            currentPage: _pagination.currentPage ? parseInt(_pagination.currentPage) : _var.pagination.currentPage,
            sizePage: _pagination.sizePage ? parseInt(_pagination.sizePage) : _var.pagination.sizePage,
        };
        try {
            if (connection) {
                // begin transaction
                await connection.beginTransaction();

                // count rows
                const where = `%${search.str ? search.str : ''}%`;
                let count = await mysql.query_transaction(connection, `select count(*) as count 
                                                                              from tbl_Deployment d
                                                                              where concat(d.deployid, ' ',d.NOCLocationName,' ',d.NOCDataCenterName,' ',d.NOCRoomName,' ',d.NOCZoneName,' ',d.NOCRackName,' ',d.REGISTRATIONDETAILCODE,' ') like ?`, [where]);
                count = count[0].count;
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
                        message: "Get Deployment Devices successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const deploymentDC = await mysql.query_transaction(connection, `select * 
                                                                                           from tbl_Deployment d
                                                                                           where concat(d.deployid, ' ',d.NOCLocationName,' ',d.NOCDataCenterName,' ',d.NOCRoomName,' ',d.NOCZoneName,' ',d.NOCRackName,' ',d.REGISTRATIONDETAILCODE,' ') like ?
                                                                                           order by deployid ASC limit ?, ? `, [where, from, pagination.sizePage]);
                    result = {
                        status: 200,
                        data: deploymentDC,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Deployment Devices  successful!"
                    };
                }
                // end transaction
                await connection.commit();
                connection.release();
                res.json(result);
            }
        } catch (error) {
            connection.rollback();
            elk.error({
                controller: 'deployment-device-controller',
                function: 'deployment',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get deployment-device failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'deployment-device-controller',
            function: 'deployment',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        result = {
            status: 500,
            message: "getZones failed!",
            data: [],
        };
        res.json(result);
    }
}

async function feedBackDeploymentDevice(req, res) {
    const body = req.body;
    const user = await base.getSession(req);
    let result = {};
    try {
        const token = surveyController.getToken();
        const data = {
            "id": body.id,
            "status": body.status // Tình trạng (Gồm: -2,-1,0,1,2,3,4)
        };

        request.post(api.deployment, data, (err, response, _body) => {
            let result = {};
            if (err) {
                result = {
                    status: 500,
                    message: err
                };

            } else {
                if (_body.code === 201) {
                    result = {
                        status: 200,
                        message: 'Update successful',
                        data: _body.data
                    };
                } else {
                    result = {
                        status: 500,
                        message: _body.message
                    };
                }

            }
            elk.insert({
                controller: 'deployment-device-controller',
                function: 'feedBackDeploymentDevice',
                data: {
                    tokenISC: token,
                    oldData: body,
                    newData: data,
                    resp: {
                        error: error,
                        response: response,
                        body: _body
                    },
                    user: user
                }
            });
            res.json(result);
        }, {Authorization: `Bearer ${token}`});

    } catch (error) {

        elk.error({
            controller: 'deployment-device-controller',
            function: 'feedBackDeploymentDevice',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Update failed!",
        };
        res.json(result);
    }
}


module.exports = {
    getDeploymentDevice,
    feedBackDeploymentDevice

}