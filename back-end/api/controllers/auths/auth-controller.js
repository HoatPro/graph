'use strict';

const Mysql = require('../../../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql(console);
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');
const base = require('../../base-controller');
const middleware = require('../../middleware/middleware');
const bcrypt = require('bcryptjs');
const basicAuth = require('basic-auth');

async function getToken(req, res) {
    try {
        const loginInfo = basicAuth(req);
        let user = null;

        if (loginInfo) { // basic auth with name and pass
            // console.log(loginInfo);
            let userName = req.name;
            let password = req.pass;
            user = await mysqlFacade.getUserByUserNameOrEmail(userName, `${user}@fpt.com.vn`);

            if (!user) {
                throw new Error('user not found', 'USER_NOT_FOUND');
            } else {
                if (!bcrypt.compareSync(`${password}`, `${user.password}`)) {
                    throw new Error('wrong password', 'WRONG_PASS');
                }
            }
        } else { // login by fpt account via token
            const authToken = req.body.token;
            const userInfo = await ssoUtil.getFPTAccountInfo(authToken);

            if (userInfo) {
                user = await mysqlFacade.getUserByUserNameOrEmail(userInfo.username, userInfo.email);
                if (!user) {
                    const insertInfo = {};
                    insertInfo.userName = userInfo.username;
                    insertInfo.email = userInfo.email;
                    insertInfo.updatedDate = insertInfo.createdDate = new Date();
                    insertInfo.status = 1;
                    insertInfo.fullName = userInfo.fullName;

                    await mysqlFacade.insertUser(insertInfo);
                    user = await mysqlFacade.getUserByUserNameOrEmail(userInfo.username, userInfo.email);
                }
            } else {
                throw new Error('cannot get user info from token', 'GET_INFO_FROM_TOKEN_ERROR');
            }
        }

        const fields = 'userId userName fullName email allow_access';
        const payload = _.pick(user, fields.split(' '));
        payload.permissions = await mysqlFacade.getAllPermissionsByUserId(user.userId);

        const refreshTokenPayload = {
            userId: user.userId,
            userName: user.userName
        };
        const refreshToken = jwt.sign(refreshTokenPayload, _var.jwt.refreshTokenSecret, {
            algorithm: _var.jwt.algorithms,
            expiresIn: _var.jwt.refreshTokenLife
        });
        const token = jwt.sign(payload, _var.jwt.tokenSecret, {
            algorithm: _var.jwt.algorithms,
            expiresIn: _var.jwt.tokenLife
        });

        const refreshTokenInfo = {
            userAgent: req.header('User-Agent') || '',
            token: refreshToken,
            userId: user.userId,
            userName: user.userName,
            tokenCount: 1,
            // lastGettedAt: new Date(),
            // loginedAt: new Date()
        };

        await mysqlFacade.insertRefreshToken(refreshTokenInfo);

        res.json({
            token,
            refreshToken
        });

    } catch (e) {
        if (e instanceof Error) {
            res.status(400).json({
                code: e.code,
                msg: e.message
            })
        } else {
            console.error('getToken error: ', e);
            res.status(500).send();
        }
    }
}

// async function getTokenByRefreshToken(req, res) {
//     try {
//         const token = req.body.refreshToken;
//         const tokenInfo = await mysqlFacade.getRefreshTokenByToken(token);
//
//         if (tokenInfo) {
//             let payload;
//             try {
//                 payload = jwt.verify(token, _var.jwt.refreshTokenSecret);
//             } catch (e) {
//                 res.status(401).send();
//                 return;
//             }
//
//             if (payload.userId === tokenInfo.userId) {
//                 const user = await mysqlFacade.getUserByUserId(payload.userId);
//
//                 const fields = 'userId userName fullName email allow_access';
//                 const data = _.pick(user, fields.split(' '));
//                 data.permissions = await mysqlFacade.getAllPermissionsByUserId(user.userId);
//
//                 const token = jwt.sign(data, _var.jwt.tokenSecret, {
//                     algorithm: _var.jwt.algorithms,
//                     expiresIn: _var.jwt.tokenLife
//                 });
//
//                 // save log
//                 tokenInfo.tokenCount++;
//                 tokenInfo.lastGettedAt = new Date();
//                 await mysqlFacade.updateRefreshToken(tokenInfo);
//
//                 res.json({token});
//             } else {
//                 throw new Error('unknow', 'UNKNOW');
//             }
//         } else {
//             throw new Error('token not found', 'TOKEN_NOT_FOUND');
//         }
//
//     } catch (e) {
//         if (e instanceof Error) {
//             res.status(400).json({
//                 code: e.code,
//                 msg: e.message
//             });
//         } else {
//             console.error('auth -> getTokenByRefreshToken', e);
//             res.status(500).send();
//         }
//     }
// }
//

async function login(req, res) {
    const body = req.body;
    let result = {};
    const _bcrypt = _var.bcrypt;

    try {
        //------TEST LOGIN --------//
        let email = body.email;
        email = email.trim().toLocaleLowerCase();
        const password = body.password;

        let exist = await new Promise(resolve => {
            mysql.query('select * from tbl_Users where email=? or username=?', [email, email], resp => {
                resolve(resp);
            })
        });

        if (exist && _.size(exist) > 0) {
            exist = exist[0];
            const compare = bcrypt.compareSync(password, exist.password);

            if (!compare) {
                result = {
                    status: 401,
                    message: "Unauthorized",
                    data: {
                        user: {}
                    }
                };
            } else {
                const permission = await middleware.checkPermission(exist.email);

                delete exist.password;

                const user = {
                    ...exist,
                    permission
                };
                let session = req.session;
                session.user = {
                    email: email,
                };
                const token = jwt.sign({
                    email: email,
                    sessionID: session.id,
                }, _var.jwt.tokenSecret, {algorithm: _var.jwt.algorithms});
                console.log(token);
                req.session.passport = {};
                req.session.passport = {user};
                result = {
                    status: 200,
                    message: "Successful",
                    data: {
                        user: user,
                        authtoken: token
                    }
                }
            }
        } else {
            result = {
                status: 500,
                message: "Login failed",
                data: {
                    user: {}
                }
            };
        }

        res.json(result);
    } catch (error) {
        elk.error({
            controller: 'auth-controller',
            function: 'login',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: body
        });
        result = {
            status: 500,
            message: "Login failed!",
            data: {
                user: {}
            }
        };
        res.json(result);
    }
}

async function authUser(req, res) {
    const body = req.body;
    let result = {};
    let user = await base.getSession(req);
    try {
        if (user) {
            const permissions = await getAuthByUser(user);
            delete user.password;
            result = {
                status: 200,
                message: "success",
                data: {
                    auth: true,
                    user: {
                        ...user,
                        permissions: permissions
                    },
                }
            };
        } else {
            result = {
                status: 403,
                message: "failure",
                data: {
                    auth: false,
                    user: user
                }
            };
        }

        res.json(result);
    } catch (error) {
        elk.error({
            controller: 'auth-controller',
            function: 'authUser',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                body,
                user
            }
        });
        result = {
            status: 500,
            message: "failure",
            data: {
                auth: false,
                user: user
            }
        };
        res.json(result);
    }
}

async function getAuthByUser(user) {
    let result = [];
    try {
        const {email, type} = user;
        let queryStr = '';
        if (type === 1) {
            queryStr = `select ug.groupId, g.groupName, a.actionId, a.actionName, a.actionKey,
        r.routeId, r.routeName, r.routeKey, r.code, r.shortName, r.icon
        from tbl_Users_Groups as ug
        join tbl_Groups as g on ug.groupId=g.groupId
        join tbl_Groups_Routes_Actions as gra on ug.groupId=gra.groupId
        join tbl_Routes_Actions as ra on ra.routeActionId=gra.routeActionId
        join tbl_Actions as a on a.actionId=ra.actionId
        join tbl_Routes as r on r.routeId=ra.routeId
        where ug.userId=? and length(r.code)>?`;

        } else {
            queryStr = `select ug.groupId, g.groupName, a.actionId, a.actionName, a.actionKey,
        r.routeId, r.routeName, r.routeKey, r.code, r.shortName, r.icon
        from tbl_Users_Groups as ug
        join tbl_Groups as g on ug.groupId=g.groupId
        join tbl_Routes_Actions as ra on ra.routeActionId=gra.routeActionId
        join tbl_Actions as a on a.actionId=ra.actionId
        join tbl_Routes as r on r.routeId=ra.routeId
        where ug.userId=? and length(r.code)>?`;

        }

        const routes = await new Promise(resolve => {
            mysql.query(queryStr, [email, 3], resp => {
                let temp = !_.isNull(resp) ? resp : [];
                resolve(temp);
            });
        });

        const routeParents = await new Promise(resolve => {
            mysql.query('select * from tbl_Routes where length(code)=?', [3], resp => {
                let temp = !_.isNull(resp) ? resp : [];

                resolve(temp);
            });
        });
        result = formatAuth(routes, routeParents);

    } catch (error) {
        elk.error({
            controller: 'auth-controller',
            function: 'getAuthByUser',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                email,
            }
        });
    }
    return result;
}

function formatAuth(routes, routeParents) {
    let result = [];

    _.forEach(routeParents, rp => {
        // push child to parent
        const codeP = rp.code;
        let children = [];

        _.forEach(routes, item => {
            const codeC = item.code;
            const sub = codeC.substring(0, 3);
            if (codeP === sub) {
                const route = _.find(children, {routeId: item.routeId});

                if (route) {
                    let actions = route.actions;
                    const action = _.find(actions, {actionId: item.actionId});

                    if (!action) {
                        actions.push({
                            groupId: item.groupId,
                            groupName: item.groupName,
                            actionId: item.actionId,
                            actionName: item.actionName,
                            actionKey: item.actionKey
                        });
                    }
                } else {
                    children.push({
                        groupId: item.groupId,
                        groupName: item.groupName,
                        routeId: item.routeId,
                        routeName: item.routeName,
                        routeKey: item.routeKey,
                        code: item.code,
                        shortName: item.shortName,
                        actions: [{
                            actionId: item.actionId,
                            actionName: item.actionName,
                            actionKey: item.actionKey
                        }]
                    })
                }
            }

        });

        if (_.size(children) > 0) {
            rp.children = children;
            result.push(rp);
        }
    });

    return result;
}

module.exports = {
    login,
    authUser,
    getToken
};


// let userrr = JSON.parse(req.sessionStore.sessions[body.keyId]).user; 1