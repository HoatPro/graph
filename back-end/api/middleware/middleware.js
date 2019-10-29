'use strict';

const Mysql = require('../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const _var = require('../../../commons/utils/var');
const jwt = require('jsonwebtoken');
const none = ['/login', '/register'];

function getUser(req) {
    const sessions = req.sessionStore.sessions;
    let user = {};
    _.forEach(sessions, (value, key) => {
        const parse = JSON.parse(value);
        const temp = parse.user;
        if (_.size(temp) > 0) {
            user = temp;
            return false;
        }
    });
    console.log(user);
    return user;
}

function verifyAPI(req, res, next) {
    const token = req.body.token || req.body['x-access-token'] || req.query.token || req.query['x-access-token'] || req.headers['x-access-token'];
    const secret = _var.jwt.secretAPI;
    // next();
    // return;
    //decode token
    if (token) {
        jwt.verify(token, secret, function (error, resp) {
            if (error) {
                return res.json({
                    status: 401,
                    message: 'Failed to authenticate token',
                })
            } else {
                if (resp.openApi) {
                    next();
                } else {
                    return res.json({
                        status: 401,
                        message: 'Failed to authenticate token',
                    })
                }
            }
        })
    } else {
        return res.json({
            status: 500,
            message: 'No token provided'
        });
    }
}

async function verifyToken(token) {
    let result = null;
    const secret = _var.jwt.secretToken;
    return new Promise(resolve => {
        jwt.verify(token, secret, function (error, resp) {
            if (resp) {
                result = resp;
            }
            resolve(result);
        })
    })
}


async function checkPermission(req, res, next) {
    const permissions = await getPermissionByUser(email);
    let format = formatPermission(permissions);
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    next();
    return;
    const verify = await verifyToken(token);
    console.log(verify);
    if (!_.isNull(verify)) {
        return format;
        next();
    } else {
        return res.json({
            status: 401,
            message: 'Failed to authenticate token'
        })
    }

}

// async function checkPermission(email) {
//     const permissions = await getPermissionByUser(email);
//     let format = formatPermission(permissions);
//     return format;
// }

function getPermissionByUser(email) {
    let result = [];
    try {
        return new Promise(resolve => {
            mysql.query(`select u.userId, u.email, g.groupId, g.groupName, gra.groupRouteActionId, ra.routeId, routeName, routeKey, 
            ra.actionId, actionName, actionKey 
            from tbl_Users as u
            join tbl_Users_Groups as ug on u.userId=ug.userId
            join tbl_Groups as g on ug.groupId=g.groupId
            join tbl_Groups_Routes_Actions as gra on ug.groupId=gra.groupId
            join tbl_Routes_Actions as ra on gra.routeActionId=ra.routeActionId
            join tbl_Actions as a on a.actionId=ra.actionId
            join tbl_Routes as r on r.routeId=ra.routeId
            where u.email=?`, [email], resp => {
                if (!_.isNull(resp)) {
                    result = resp;
                }
                resolve(result);
            });
        })
    } catch (error) {
        return [];
    }
}

function formatPermission(data) {
    let result = [];
    _.forEach(data, item => {
        const find = _.find(result, {routeId: item.routeId});
        console.log(find);
        if (!find) {
            let temp = {
                routeId: item.routeId,
                routeKey: item.routeKey,
                routeName: item.routeName,
                actions: [
                    {
                        actionId: item.actionId,
                        actionKey: item.actionKey,
                        actionName: item.actionName
                    }
                ]
            };

            result.push(temp);
        } else {
            let actions = find.actions;

            if (_.findIndex(actions, {actionId: item.actionId}) === -1) actions.push({
                actionId: item.actionId,
                actionKey: item.actionKey,
                actionName: item.actionName
            });
        }
    });
    return result;
}

module.exports = {
    checkPermission,
    getUser,
    verifyAPI,
};