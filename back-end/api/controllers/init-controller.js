const Mysql = require('../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const _var = require('../../../commons/utils/var');
const elk = require('../../../commons/databases/elasticsearch/facade/elastic-facade');
const type = _var.logConfig.type;
const baseController = require('../base-controller');
// const testSearch =require('../../../commons/databases/elasticsearch/test');
// function getDataSurveyDC(req,res) {
//     console.log(testSearch);
//
// }
async function surveyDC(req, res) {
    const body = req.body;
    let result = {};
    const token = baseController.getToken(req);
    // const address = baseController.getAddress(req);
    try {
        // const CONTRACT = ['CUSTOMERNAME', 'CONTRACTNUMBER', 'CONTRACTDATE', 'FROMDATE_CONTRACT', 'TODATE_CONTRACT', 'SALEPROMOTIONINFORMATION', 'CONTACTNAME', 'CONTACTPHONENUMBER', 'CREATEDBY', 'CREATEDDATE', 'SALENAME'];
        const data = {
            controller: "init-controller",
            function: 'surveyDC',
            type: type.survey,
            data: {
                body: body,
                token: token,
                // address: address
            }
        };
        // console.log('surveyDC', data);
        elk.insert(data, function (resp) {
            if (resp) {
                result = {
                    status: 200,
                    message: "Successful!"
                };

            } else {
                result = {
                    status: 500,
                    message: "Failed!"
                };
            }
            res.json(result);
        });
        // const connection = await mysql.transaction();
        // try {
        //     if (connection) {
        //         // begin transaction
        //         await connection.beginTransaction();
        //         let dataHits = data.hits;
        //         let dataObj = dataHits.hits;
        //         let dataChange = [];
        //         try {
        //             for (let item = 0; item < dataObj.length; item++) {
        //                 const source = dataObj[item]._source;
        //                 const data = source.data;
        //                 if (data) {
        //                     const body = data.body;
        //                     if (body) {
        //                         dataChange.push({
        //                             ID: body.ID,
        //                             surveyid : body.surveyid,
        //                             ACCESSSTATUSID: body.ACCESSSTATUSID,
        //                             PRIORITYTYPEID: body.PRIORITYTYPEID,
        //                             CUSTOMERTYPE: body.CUSTOMERTYPE,
        //                             updatedby: body.updatedby,
        //                             DESCRIPTIONEXCESS: body.DESCRIPTIONEXCESS,
        //                             ISREQUESTNOC: body.ISREQUESTNOC,
        //                             DEVICELOCATION: body.DEVICELOCATION,
        //                             ADDRESSIP: body.ADDRESSIP,
        //                             UpdatedDate: body.UpdatedDate,
        //                             DATACENTERDEPLOYID: body.DATACENTERDEPLOYID,
        //                             DATACENTERDEPLOYNAME: body.DATACENTERDEPLOYNAME,
        //                             REGISTRATIONDETAILCODE: body.REGISTRATIONDETAILCODE,
        //                             SERVICETYPEID: body.SERVICETYPEID,
        //                             LOCATIONID: body.LOCATIONID,
        //                             CUSTOMERNAME: body.CUSTOMERNAME,
        //                             CONTRACTNUMBER: body.CONTRACTNUMBER,
        //                             CONTRACTDATE: body.CONTRACTDATE,
        //                             USERNAME: body.USERNAME,
        //                             FROMDATE_CONTRACT: body.FROMDATE_CONTRACT,
        //                             TODATE_CONTRACT: body.TODATE_CONTRACT,
        //                             SALEPROMOTIONINFORMATION: body.SALEPROMOTIONINFORMATION,
        //                             CONTACTNAME: body.CONTACTNAME,
        //                             CONTACTPHONENUMBER: body.CONTACTPHONENUMBER,
        //                             CREATEDBY: body.CREATEDBY,
        //                             CREATEDDATE: body.CREATEDDATE,
        //                             SALENAME: body.SALENAME,
        //                             DEVICESIZE: body.DEVICESIZE,
        //                             CAPACITYONEPOWER: body.CAPACITYONEPOWER,
        //                             APACITYTWOPOWER: body.APACITYTWOPOWER,
        //                             IPNUMBER: body.IPNUMBER,
        //                             BRANDNAME: body.BRANDNAME,
        //                             CPU: body.CPU,
        //                             RAM: body.RAM,
        //                             HDD: body.HDD,
        //                             BANDWIDTHLOCAL: body.BANDWIDTHLOCAL,
        //                             BANDWIDTHINTER: body.BANDWIDTHINTER,
        //                             NETWORKSOCKET: body.NETWORKSOCKET,
        //                             INTERNETCABLE: body.INTERNETCABLE,
        //                             MANAGERSERVERADD: body.MANAGERSERVERADD,
        //                             FIREWALLADD: body.FIREWALLADD,
        //                             CPANELADD: body.CPANELADD,
        //                             OSADD: body.OSADD,
        //                             DESIGNRACK: body.DESIGNRACK,
        //                             CAPACITYRACK: body.CAPACITYRACK,
        //                             RENTSPACE: body.RENTSPACE,
        //                             SERVERINSTALLEDNUMBER: body.SERVERINSTALLEDNUMBER,
        //                             POWERSUPPYRACK: body.POWERSUPPYRACK,
        //                             PDUSTANDARD: body.PDUSTANDARD,
        //                             capacitytotaL1RACK: body.capacitytotaL1RACK,
        //                             capacitymaX1RACK: body.capacitymaX1RACK,
        //                             IPFREE: body.IPFREE,
        //                             IPNOTFREE: body.IPNOTFREE
        //                         });
        //
        //                     }
        //                 }
        //             }
        //         } catch (e) {
        //             console.log(e);
        //         }
        //         const uniq = _.uniqBy(dataChange, function (o) {
        //             return o.ID
        //         });
        //         let dataGet = [];
        //         for (let ite = 0; ite < uniq.length; ite++) {
        //             if (uniq[ite].ID) {
        //                 dataGet.push([
        //                     uniq[ite].ID,
        //                     uniq[ite].surveyid,
        //                     uniq[ite].ACCESSSTATUSID,
        //                     uniq[ite].PRIORITYTYPEID,
        //                     uniq[ite].CUSTOMERTYPE,
        //                     uniq[ite].updatedby,
        //                     uniq[ite].DESCRIPTIONEXCESS,
        //                     uniq[ite].ISREQUESTNOC,
        //                     uniq[ite].DEVICELOCATION,
        //                     uniq[ite].ADDRESSIP,
        //                     uniq[ite].UpdatedDate,
        //                     uniq[ite].DATACENTERDEPLOYID,
        //                     uniq[ite].DATACENTERDEPLOYNAME,
        //                     uniq[ite].REGISTRATIONDETAILCODE,
        //                     uniq[ite].SERVICETYPEID,
        //                     uniq[ite].LOCATIONID,
        //                     uniq[ite].CUSTOMERNAME,
        //                     uniq[ite].CONTRACTNUMBER,
        //                     uniq[ite].CONTRACTDATE,
        //                     uniq[ite].USERNAME,
        //                     uniq[ite].FROMDATE_CONTRACT,
        //                     uniq[ite].TODATE_CONTRACT,
        //                     uniq[ite].SALEPROMOTIONINFORMATION,
        //                     uniq[ite].CONTACTNAME,
        //                     uniq[ite].CONTACTPHONENUMBER,
        //                     uniq[ite].CREATEDBY,
        //                     uniq[ite].CREATEDDATE,
        //                     uniq[ite].SALENAME,
        //                     uniq[ite].DEVICESIZE,
        //                     uniq[ite].CAPACITYONEPOWER,
        //                     uniq[ite].APACITYTWOPOWER,
        //                     uniq[ite].IPNUMBER,
        //                     uniq[ite].BRANDNAME,
        //                     uniq[ite].CPU,
        //                     uniq[ite].RAM,
        //                     uniq[ite].HDD,
        //                     uniq[ite].BANDWIDTHLOCAL,
        //                     uniq[ite].BANDWIDTHINTER,
        //                     uniq[ite].NETWORKSOCKET,
        //                     uniq[ite].INTERNETCABLE,
        //                     uniq[ite].MANAGERSERVERADD,
        //                     uniq[ite].FIREWALLADD,
        //                     uniq[ite].CPANELADD,
        //                     uniq[ite].OSADD,
        //                     uniq[ite].DESIGNRACK,
        //                     uniq[ite].CAPACITYRACK,
        //                     uniq[ite].RENTSPACE,
        //                     uniq[ite].SERVERINSTALLEDNUMBER,
        //                     uniq[ite].POWERSUPPYRACK,
        //                     uniq[ite].PDUSTANDARD,
        //                     uniq[ite].capacitytotaL1RACK,
        //                     uniq[ite].capacitymaX1RACK,
        //                     uniq[ite].IPFREE,
        //                     uniq[ite].IPNOTFREE
        //                 ])
        //             }
        //
        //         }
        //         const sql = `INSERT INTO tbl_SurveyDevice (ID, surveyid,ACCESSSTATUSID, PRIORITYTYPEID, CUSTOMERTYPE,updatedby, DESCRIPTIONEXCESS,ISREQUESTNOC, DEVICELOCATION,ADDRESSIP,UpdatedDate,DATACENTERDEPLOYID,DATACENTERDEPLOYNAME,REGISTRATIONDETAILCODE,SERVICETYPEID,LOCATIONID,CUSTOMERNAME,CONTRACTNUMBER,CONTRACTDATE,USERNAME,FROMDATE_CONTRACT,TODATE_CONTRACT,SALEPROMOTIONINFORMATION,CONTACTNAME,CONTACTPHONENUMBER,CREATEDBY,CREATEDDATE,SALENAME,DEVICESIZE,CAPACITYONEPOWER,APACITYTWOPOWER,IPNUMBER,BRANDNAME,CPU,RAM,HDD,BANDWIDTHLOCAL,BANDWIDTHINTER,NETWORKSOCKET,INTERNETCABLE,MANAGERSERVERADD,FIREWALLADD,CPANELADD,OSADD,DESIGNRACK,CAPACITYRACK,RENTSPACE,SERVERINSTALLEDNUMBER,POWERSUPPYRACK,PDUSTANDARD,capacitytotaL1RACK,capacitymaX1RACK,IPFREE,IPNOTFREE) VALUES ?`;
        //         const insertData = await mysql.query_transaction(connection, sql, [dataGet]);
        //         if (_.isNull(insertData)) {
        //             result = {
        //                 status: 500,
        //                 message: "Insert failed!"
        //             };
        //
        //         } else {
        //             result = {
        //                 status: 200,
        //                 message: "Insert successful!",
        //                 data: data
        //             }
        //         }
        //     }
        //     await connection.commit();
        //     connection.release();
        //     res.json(result);
        // } catch (error) {
        //     elk.error({
        //         controller: 'init-controller',
        //         function: 'surveyDC',
        //         error: {
        //             message: error.message,
        //             stack: error.stack
        //         },
        //         data: {
        //             body: body,
        //             token: token,
        //             address: address
        //         }
        //     });
        //     result = {
        //         status: 500,
        //         message: "Failed!"
        //     };
        //     res.json(result);
        // }
    } catch (error) {
        elk.error({
            controller: 'init-controller',
            function: 'surveyDC',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                body: body,
                token: token,
                // address: address
            }
        });
        result = {
            status: 500,
            message: "Failed!"
        };
        res.json(result);
    }
}

async function deployment(req, res) {
    const body = req.body;
    let result = {};
    const token = baseController.getToken(req);
    const address = baseController.getAddress(req);
    try {
        const data = {
            controller: "init-controller",
            function: 'deployment',
            type: type.survey,
            data: {
                body: body,
                token: token,
                address: address
            }
        };
        // console.log('deployment', data);
        elk.insert(data, function (resp) {
            if (resp) {
                result = {
                    status: 200,
                    message: "Successful!"
                };

            } else {
                result = {
                    status: 500,
                    message: "Failed!"
                };
            }
            res.json(result);
        });
        // const connection = await mysql.transaction();
        // try {
        //     if (connection) {
        //         // begin transaction
        //         await connection.beginTransaction();
        //         let dataDeploymentHits = data.hits;
        //         let dataDeploymentObj = dataDeploymentHits.hits;
        //         let dataDeploymentChange = [];
        //         try {
        //             for (let item = 0; item < dataDeploymentObj.length; item++) {
        //                 const source = dataDeploymentObj[item]._source;
        //                 const data = source.data;
        //                 if (data) {
        //                     const body = data.body;
        //                     if (body) {
        //                         if (body.IPNOTFREE !== undefined) {
        //                             dataDeploymentChange.push({
        //                                 ID: body.ID,
        //                                 NOCDataCenterId: body.NOCDataCenterId,
        //                                 NOCDataCenterName: body.NOCDataCenterName,
        //                                 NOCLocationId: body.NOCLocationId,
        //                                 NOCLocationName: body.NOCLocationName,
        //                                 NOCNumberOfConnection: body.NOCNumberOfConnection,
        //                                 NOCPort: body.NOCPort,
        //                                 NOCRackId: body.NOCRackId,
        //                                 NOCRackName: body.NOCRackName,
        //                                 NOCRackTotalu: body.NOCRackTotalu,
        //                                 NOCRoomId: body.NOCRoomId,
        //                                 NOCRoomName: body.NOCRoomName,
        //                                 NOCZoneId: body.NOCZoneId,
        //                                 NOCZoneName: body.NOCZoneName,
        //                                 salecenterid: body.salecenterid,
        //                                 salename: body.salename,
        //                                 salephonenumber: body.salephonenumber,
        //                                 servicegroupname: body.servicegroupname,
        //                                 servicetypename: body.servicetypename,
        //                                 deployid: body.deployid,
        //                                 REGISTRATIONCODE: body.REGISTRATIONCODE,
        //                                 REGISTRATIONID: body.REGISTRATIONID,
        //                                 CONTRACTID: body.CONTRACTID,
        //                                 OBJID: body.OBJID,
        //                                 REGISTRATIONDETAILCODE: body.REGISTRATIONDETAILCODE,
        //                                 SERVICETYPEID: body.SERVICETYPEID,
        //                                 DEVICESIZE: body.DEVICESIZE,
        //                                 CAPACITYONEPOWER: body.CAPACITYONEPOWER,
        //                                 APACITYTWOPOWER: body.APACITYTWOPOWER,
        //                                 IPNUMBER: body.IPNUMBER,
        //                                 BRANDNAME: body.BRANDNAME,
        //                                 CPU: body.CPU,
        //                                 RAM: body.RAM,
        //                                 HDD: body.HDD,
        //                                 BANDWIDTHLOCAL: body.BANDWIDTHLOCAL,
        //                                 BANDWIDTHINTER: body.BANDWIDTHINTER,
        //                                 NETWORKSOCKET: body.NETWORKSOCKET,
        //                                 INTERNETCABLE: body.INTERNETCABLE,
        //                                 MANAGERSERVERADD: body.MANAGERSERVERADD,
        //                                 FIREWALLADD: body.FIREWALLADD,
        //                                 CPANELADD: body.CPANELADD,
        //                                 OSADD: body.OSADD,
        //                                 DESIGNRACK: body.DESIGNRACK,
        //                                 CAPACITYRACK: body.CAPACITYRACK,
        //                                 RENTSPACE: body.RENTSPACE,
        //                                 SERVERINSTALLEDNUMBER: body.SERVERINSTALLEDNUMBER,
        //                                 POWERSUPPYRACK: body.POWERSUPPYRACK,
        //                                 PDUSTANDARD: body.PDUSTANDARD,
        //                                 capacitytotaL1RACK: body.capacitytotaL1RACK,
        //                                 capacitymaX1RACK: body.capacitymaX1RACK,
        //                                 DESCRIPTION: body.DESCRIPTION,
        //                                 STATUS: body.STATUS,
        //                                 ISNEEDSOLUTION: body.ISNEEDSOLUTION,
        //                                 SALEPROMOTIONINFORMATION: body.SALEPROMOTIONINFORMATION,
        //                                 SERVICEGROUPID: body.SERVICEGROUPID,
        //                                 ISNEEDSURVEY: body.ISNEEDSURVEY,
        //                                 FROMDATE: body.FROMDATE,
        //                                 TODATE: body.TODATE,
        //                                 CREATEDBY: body.CREATEDBY,
        //                                 CREATEDDATE: body.CREATEDDATE,
        //                                 UPDATEDBY: body.UPDATEDBY,
        //                                 UPDATEDDATE: body.UPDATEDDATE,
        //                                 BARCODE: body.BARCODE,
        //                                 ISDEPLOY: body.ISDEPLOY,
        //                                 BRANCHID: body.BRANCHID,
        //                                 SUBCOMPANYID: body.SUBCOMPANYID,
        //                                 DATACENTERDEPLOYID: body.DATACENTERDEPLOYID,
        //                                 AREADEPLOYID: body.AREADEPLOYID,
        //                                 DATEDEPLOY: body.DATEDEPLOY,
        //                                 LOCATIONDCDEPLOYID: body.LOCATIONDCDEPLOYID,
        //                                 IPFREE: body.IPFREE,
        //                                 IPNOTFREE: body.IPNOTFREE
        //                             })
        //
        //
        //                         }
        //
        //
        //                     }
        //                 }
        //             }
        //         } catch (e) {
        //             console.log(e);
        //         }
        //         const uniqData = _.uniqBy(dataDeploymentChange, function (o) {
        //             return o.ID
        //         });
        //         let dataPush = [];
        //         for (let ite = 0; ite < uniqData.length; ite++) {
        //             if (uniqData[ite].ID) {
        //                 dataPush.push([
        //                     uniqData[ite].ID,
        //                     uniqData[ite].NOCDataCenterId,
        //                     uniqData[ite].NOCDataCenterName,
        //                     uniqData[ite].NOCLocationId,
        //                     uniqData[ite].NOCLocationName,
        //                     uniqData[ite].NOCNumberOfConnection,
        //                     uniqData[ite].NOCPort,
        //                     uniqData[ite].NOCRackId,
        //                     uniqData[ite].NOCRackName,
        //                     uniqData[ite].NOCRackTotalu,
        //                     uniqData[ite].NOCRoomId,
        //                     uniqData[ite].NOCRoomName,
        //                     uniqData[ite].NOCZoneId,
        //                     uniqData[ite].NOCZoneName,
        //                     uniqData[ite].salecenterid,
        //                     uniqData[ite].salename,
        //                     uniqData[ite].salephonenumber,
        //                     uniqData[ite].servicegroupname,
        //                     uniqData[ite].servicetypename,
        //                     uniqData[ite].deployid,
        //                     uniqData[ite].REGISTRATIONCODE,
        //                     uniqData[ite].REGISTRATIONID,
        //                     uniqData[ite].CONTRACTID,
        //                     uniqData[ite].OBJID,
        //                     uniqData[ite].REGISTRATIONDETAILCODE,
        //                     uniqData[ite].SERVICETYPEID,
        //                     uniqData[ite].DEVICESIZE,
        //                     uniqData[ite].CAPACITYONEPOWER,
        //                     uniqData[ite].APACITYTWOPOWER,
        //                     uniqData[ite].IPNUMBER,
        //                     uniqData[ite].BRANDNAME,
        //                     uniqData[ite].CPU,
        //                     uniqData[ite].RAM,
        //                     uniqData[ite].HDD,
        //                     uniqData[ite].BANDWIDTHLOCAL,
        //                     uniqData[ite].BANDWIDTHINTER,
        //                     uniqData[ite].NETWORKSOCKET,
        //                     uniqData[ite].INTERNETCABLE,
        //                     uniqData[ite].MANAGERSERVERADD,
        //                     uniqData[ite].FIREWALLADD,
        //                     uniqData[ite].CPANELADD,
        //                     uniqData[ite].OSADD,
        //                     uniqData[ite].DESIGNRACK,
        //                     uniqData[ite].CAPACITYRACK,
        //                     uniqData[ite].RENTSPACE,
        //                     uniqData[ite].SERVERINSTALLEDNUMBER,
        //                     uniqData[ite].POWERSUPPYRACK,
        //                     uniqData[ite].PDUSTANDARD,
        //                     uniqData[ite].capacitytotaL1RACK,
        //                     uniqData[ite].capacitymaX1RACK,
        //                     uniqData[ite].DESCRIPTION,
        //                     uniqData[ite].STATUS,
        //                     uniqData[ite].ISNEEDSOLUTION,
        //                     uniqData[ite].SALEPROMOTIONINFORMATION,
        //                     uniqData[ite].SERVICEGROUPID,
        //                     uniqData[ite].ISNEEDSURVEY,
        //                     uniqData[ite].FROMDATE,
        //                     uniqData[ite].TODATE,
        //                     uniqData[ite].CREATEDBY,
        //                     uniqData[ite].CREATEDDATE,
        //                     uniqData[ite].UPDATEDBY,
        //                     uniqData[ite].UPDATEDDATE,
        //                     uniqData[ite].BARCODE,
        //                     uniqData[ite].ISDEPLOY,
        //                     uniqData[ite].BRANCHID,
        //                     uniqData[ite].SUBCOMPANYID,
        //                     uniqData[ite].DATACENTERDEPLOYID,
        //                     uniqData[ite].AREADEPLOYID,
        //                     uniqData[ite].DATEDEPLOY,
        //                     uniqData[ite].LOCATIONDCDEPLOYID,
        //                     uniqData[ite].IPFREE,
        //                     uniqData[ite].IPNOTFREE
        //                 ])
        //             }
        //
        //         }
        //         const sql = `INSERT INTO tbl_Deployment (ID, NOCDataCenterId, NOCDataCenterName, NOCLocationId,NOCLocationName, NOCNumberOfConnection,NOCPort, NOCRackId,NOCRackName,NOCRackTotalu,NOCRoomId,NOCRoomName,NOCZoneId,NOCZoneName,salecenterid,salename,salephonenumber,servicegroupname,servicetypename,deployid,REGISTRATIONCODE,REGISTRATIONID,CONTRACTID,OBJID,REGISTRATIONDETAILCODE,SERVICETYPEID,DEVICESIZE,CAPACITYONEPOWER,APACITYTWOPOWER,IPNUMBER,BRANDNAME,CPU,RAM,HDD,BANDWIDTHLOCAL,BANDWIDTHINTER,NETWORKSOCKET,INTERNETCABLE,MANAGERSERVERADD,FIREWALLADD,CPANELADD,OSADD,DESIGNRACK,CAPACITYRACK,RENTSPACE,SERVERINSTALLEDNUMBER,POWERSUPPYRACK,PDUSTANDARD,capacitytotaL1RACK,capacitymaX1RACK,DESCRIPTION,STATUS ,ISNEEDSOLUTION ,SALEPROMOTIONINFORMATION ,SERVICEGROUPID ,ISNEEDSURVEY ,FROMDATE ,TODATE ,CREATEDBY ,CREATEDDATE ,UPDATEDBY ,UPDATEDDATE ,BARCODE ,ISDEPLOY ,BRANCHID ,SUBCOMPANYID ,DATACENTERDEPLOYID ,AREADEPLOYID ,DATEDEPLOY ,LOCATIONDCDEPLOYID ,IPFREE,IPNOTFREE) VALUES ?`;
        //         const insertData =await mysql.query_transaction(connection, sql, [dataPush]);
        //         if (_.isNull(insertData)) {
        //             result = {
        //                 status: 500,
        //                 message: "Insert failed!"
        //             };
        //
        //         } else {
        //             result = {
        //                 status: 200,
        //                 message: "Insert successful!",
        //                 data: data
        //             }
        //         }
        //     }
        //     connection.commit();
        //     connection.release();
        //     res.json(result);
        //
        //
        // } catch (error) {
        //     elk.error({
        //         controller: 'init-controller',
        //         function: 'deployment',
        //         error: {
        //             message: error.message,
        //             stack: error.stack
        //         },
        //         data: {
        //             body: body,
        //             token: token,
        //             address: address
        //         }
        //     });
        //     result = {
        //         status: 500,
        //         message: "Failed!"
        //     };
        //     res.json(result);
        // }
    } catch (error) {
        elk.error({
            controller: 'init-controller',
            function: 'deployment',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                body: body,
                token: token,
                address: address
            }
        });
        result = {
            status: 500,
            message: "Failed!"
        };
        res.json(result);
    }
}

function getLocation(req, res) {
    const query = req.query;
    let result = {};
    const token = baseController.getToken(req);
    const address = baseController.getAddress(req);
    try {
        let str = `select locationId, locationName, description from tbl_Locations`;
        let params = null;

        mysql.query(str, params, resp => {
            let data = [];

            if (!_.isNull(resp)) {
                data = resp;
                result = {
                    status: 200,
                    message: "Successful!",
                    data: data
                };
            } else {
                result = {
                    status: 500,
                    message: "Failed!",
                    data: data
                };
            }

            // log
            elk.insert({
                controller: "init-controller",
                function: 'getLocation',
                type: type.getLocation,
                data: {
                    query: query,
                    token: token,
                    address: address
                }
            }, respLog => {
                console.log(respLog);
            });

            res.json(result);
        });

    } catch (error) {
        elk.error({
            controller: 'init-controller',
            function: 'getLocation',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                query: query,
                token: token,
                address: address
            }
        });
        result = {
            status: 500,
            message: "Failed!"
        };
        res.json(result);
    }
}

function getDataCenter(req, res) {
    const query = req.query;
    let result = {};
    const token = baseController.getToken(req);
    const address = baseController.getAddress(req);
    try {
        let str = 'select dataCenterId, dataCenterName, locationId, description from tbl_DataCenters';
        let params = null;
        const locationId = query.locationId;
        if (locationId) {
            str += ' where locationId=?';
            params = [locationId];
        }
        mysql.query(str, params, resp => {
            let data = [];

            if (!_.isNull(resp)) {
                data = resp;
                result = {
                    status: 200,
                    message: "Successful!",
                    data: data
                };
            } else {
                result = {
                    status: 500,
                    message: "Failed!",
                    data: data
                };
            }

            // log
            elk.insert({
                controller: "init-controller",
                function: 'getDataCenter',
                type: type.getDataCenter,
                data: {
                    query: query,
                    token: token,
                    address: address
                }
            }, respLog => {
                console.log(respLog);
            });

            res.json(result);
        });

    } catch (error) {
        elk.error({
            controller: 'init-controller',
            function: 'getDataCenter',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                query: query,
                token: token,
                address: address
            }
        });
        result = {
            status: 500,
            message: "Failed!"
        };
        res.json(result);
    }
}

function getRoom(req, res) {
    const query = req.query;
    let result = {};
    const token = baseController.getToken(req);
    const address = baseController.getAddress(req);
    try {
        let str = 'select roomId, roomName, dataCenterId, description from tbl_Rooms';
        let params = null;
        const dataCenterId = query.dataCenterId;
        if (dataCenterId) {
            str += ' where dataCenterId=?';
            params = [dataCenterId];
        }

        mysql.query(str, params, resp => {
            let data = [];

            if (!_.isNull(resp)) {
                data = resp;
                result = {
                    status: 200,
                    message: "Successful!",
                    data: data
                };
            } else {
                result = {
                    status: 500,
                    message: "Failed!",
                    data: data
                };
            }

            // log
            elk.insert({
                controller: "init-controller",
                function: 'getRoom',
                type: type.getRoom,
                data: {
                    query: query,
                    token: token,
                    address: address
                }
            }, respLog => {
                console.log(respLog);
            });

            res.json(result);
        });

    } catch (error) {
        elk.error({
            controller: 'init-controller',
            function: 'getRoom',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                query: query,
                token: token,
                address: address
            }
        });
        result = {
            status: 500,
            message: "Failed!"
        };
        res.json(result);
    }
}

function getZone(req, res) {
    const query = req.query;
    let result = {};
    const token = baseController.getToken(req);
    const address = baseController.getAddress(req);
    try {
        let str = 'select zoneId, zoneName, roomId from tbl_Zones';
        let params = null;
        const roomId = query.roomId;
        if (roomId) {
            str += ' where roomId=?';
            params = [roomId];
        }

        mysql.query(str, params, resp => {
            let data = [];

            if (!_.isNull(resp)) {
                data = resp;
                result = {
                    status: 200,
                    message: "Successful!",
                    data: data
                };
            } else {
                result = {
                    status: 500,
                    message: "Failed!",
                    data: data
                };
            }

            // log
            elk.insert({
                controller: "init-controller",
                function: 'getZone',
                type: type.getZone,
                data: {
                    query: query,
                    token: token,
                    address: address
                }
            }, respLog => {
                console.log(respLog);
            });

            res.json(result);
        });

    } catch (error) {
        elk.error({
            controller: 'init-controller',
            function: 'getZone',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                query: query,
                token: token,
                address: address
            }
        });
        result = {
            status: 500,
            message: "Failed!"
        };
        res.json(result);
    }
}

function getRack(req, res) {
    const query = req.query;
    let result = {};
    const token = baseController.getToken(req);
    const address = baseController.getAddress(req);
    try {
        let str = 'select rackId, rackName, zoneId from tbl_Racks';
        let params = null;
        const zoneId = query.zoneId;
        if (zoneId) {
            str += ' where zoneId=?';
            params = [zoneId];
        }

        mysql.query(str, params, resp => {
            let data = [];

            if (!_.isNull(resp)) {
                data = resp;
                result = {
                    status: 200,
                    message: "Successful!",
                    data: data
                };
            } else {
                result = {
                    status: 500,
                    message: "Failed!",
                    data: data
                };
            }

            // log
            elk.insert({
                controller: "init-controller",
                function: 'getRack',
                type: type.getRack,
                data: {
                    query: query,
                    token: token,
                    address: address
                }
            }, respLog => {
                console.log(respLog);
            });

            res.json(result);
        });

    } catch (error) {
        elk.error({
            controller: 'init-controller',
            function: 'getRack',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                query: query,
                token: token,
                address: address
            }
        });
        result = {
            status: 500,
            message: "Failed!"
        };
        res.json(result);
    }
}

module.exports = {
    surveyDC,
    deployment,
    getLocation,
    getDataCenter,
    getRoom,
    getZone,
    getRack,
};