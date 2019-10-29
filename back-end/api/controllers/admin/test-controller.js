'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../../commons/utils/var');

async function getDetailActionRole(req, res) {
    let result = [];
    // tbl_Groups group
    // tbl_Groups_Routes_Actions permission
    // tbl_Routes   routes
    // tbl_Actions  action
    try {
        mysql.query(`select a.actionId,a.actionName,a.actionKey,a.description,rou.routeId,rou.routeName
            from tbl_Actions as a
            join tbl_Routes_Actions as ra on a.actionId=ra.actionId
            join tbl_Routes as rou on ra.routeId=rou.routeId`, null, resp => {
            let temp = [];
            if (!_.isNull(resp)) {
                temp = formatActionRoute(resp);
            }
            result = {
                status: 200,
                message: 'Get all action Router successful',
                data: temp
            };
            res.json(result);
        });
    } catch (error) {
        elk.error({
            controller: 'actions-controller',
            function: 'getDetailActionRouter',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {}
        });
        res.json({
            status: 500,
            message: 'Get all action Router failed',
            data: []
        });
    }
}

function formatActionRoute(data) {
    const router = {};
    let result = data.reduce((unique, o) => {
        if(!unique.some(obj => obj.routeId === o.routeId && obj.actionId === o.actionId)) {
            unique.push(o);
        }
        return unique;
    },[]);

    for (let i = 0; i<result.length ; i++) {
        let routeName = result[i].routeName;
        if (!router[routeName]) {
            router[routeName] = [];
        }
        router[routeName].push({
            actionId: result[i].actionId,
            actionKey: result[i].actionKey,
        });
    }
    let myArray = [];
    for (let routeName in router) {
        myArray.push({router: routeName, actions: router[routeName]});
    }
    return myArray;

}

module.exports = {
    getDetailActionRole
};