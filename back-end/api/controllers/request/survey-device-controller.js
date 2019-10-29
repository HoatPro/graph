'use strict';
const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');
const type = _var.logConfig.type;
const base = require('../../base-controller');
// var request = require('request');
const api = require('../../helpers/api');
const request = require('../../helpers/request');

function getToken() {
    return new Promise(resolve => {
        request.post(api.token, {
            username: "Noc",
            password: "s0Qm6RD6oKYDb9lw60KJlF4owrrNyIeT+6+FMAG+t/o4TKWY9N8/x6Ny7Zrs"
        }, (error, response, body) => {
            let result = null;
            if (error) {
                elk.error({
                    controller: 'survey-device-controller',
                    function: 'getToken',
                    error: error,
                    data: {},
                    // user: user
                });
            } else {
                result = body.token;
            }
            resolve(result);
        });
    });
}

async function getSurveyDevice(req, res) {
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
                const str = search.str || '';
                const accessStatusId = search.accessStatusId || '';
                const priorityTypeId = search.priorityTypeId || '';
                let param = [], where = [];

                if (str) {
                    where.push("concat_ws(' ',sd.REGISTRATIONDETAILCODE,sd.surveyid) like ?");
                    param.push(`%${str}%`);
                }
                if (accessStatusId) {
                    where.push('sd.ACCESSSTATUSID=?');
                    param.push(accessStatusId);
                }
                if (priorityTypeId) {
                    where.push('sd.PRIORITYTYPEID=?');
                    param.push(priorityTypeId);
                }

                const strCount = `select count(*) as count 
                                  from tbl_SurveyDevice  sd
                                   ${_.size(where) > 0 ? 'where ' + where.join(' and ') : ''}`;
                let count = await mysql.query_transaction(connection, strCount, param);
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
                        message: "Get Survey Devices successful!"
                    };
                } else {
                    const from = pagination.currentPage * pagination.sizePage;
                    const surveyDC = await mysql.query_transaction(connection, `select * 
                                                                                      from tbl_SurveyDevice   sd
                                                                                       ${_.size(where) > 0 ? 'where ' + where.join(' and ') : ''}
                                                                                       order by surveyid ASC limit ?, ? `, [...param, from, pagination.sizePage]);

                    result = {
                        status: 200,
                        data: surveyDC,
                        pagination: {
                            currentPage: pagination.currentPage,
                            countPage: countPage,
                            sizePage: pagination.sizePage
                        },
                        message: "Get Survey Devices successful!"
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
                controller: 'survey-device-controller',
                function: 'getSurveyDC',
                error: {
                    message: error.message,
                    stack: error.stack
                },
                data: query,
                // user: user
            });
            result = {
                status: 500,
                message: "Get survey-device failed"
            };
            res.json(result);
        }
    } catch (error) {
        elk.error({
            controller: 'survey-device-controller',
            function: 'getSurveyDC',
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


async function feedbackSurvey(req, res) {
    const body = req.body;
    const user = await base.getSession(req);
    let result = {};
    try {
        const token = await getToken();
        const data = {
            "id": body.ID,
            "accessstatusid": body.newStatus,
            "prioritytypeid": body.PRIORITYTYPEID,
            "customertype": body.CUSTOMERTYPE,
            "updatedby": user.email,
            "description": body.description,
            "source": "string",
            "devicelocation": body.DEVICELOCATION,
            "addressip": body.ADDRESSIP
        };

        request.post(api.survey, data, (err, response, _body) => {
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
                controller: 'survey-device-controller',
                function: 'feedbackSurvey',
                data: {
                    tokenISC: token,
                    oldData: body,
                    newData: data,
                    resp: {
                        error: err,
                        response: response,
                        body: _body
                    },
                    user: user
                }
            }, () => {
            });
            res.json(result);

        }, {Authorization: `Bearer ${token}`});

    } catch (error) {

        elk.error({
            controller: 'survey-device-controller',
            function: 'updateSurveyDC',
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
    getSurveyDevice,
    feedbackSurvey,
    getToken
};