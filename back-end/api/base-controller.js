const moment = require("moment");
const redis = require('../../commons/databases/redis/facade/redis-facade');
const bcrypt = require('bcryptjs');
const Mysql = require('../../commons/databases/my-sql/facade/backend');
const mysql = new Mysql();
const _var = require('../../commons/utils/var');
const _ = require('lodash');
const middleware = require('../api/middleware/middleware');
const jwt = require('jsonwebtoken');
const elk = require('../../commons/databases/elasticsearch/facade/elastic-facade');

async function getSession(req, name) {
    let result = null;
    name = name || 'user';
    const _bcrypt = _var.bcrypt;
    const _jwt = _var.jwt;
    try {
        const access_token = getToken(req, 'access_token');
        if (access_token) {
            const sess = `sess:${access_token}`;
            let value = await redis.get(sess);
            if (value) {
                value = JSON.parse(value);
                if (name === 'user') {
                    const passport = value.passport;
                    let user = {};

                    if (passport) {
                        user = passport.user || {};
                    } else {
                        user = value.user || {};
                    }

                    const userId = user.userId;
                    const email = user.email;
                    const username = user.username;
                    const fullName = user.fullName;

                    // chua co id thi get trong db
                    if (!userId) {
                        let exist = await new Promise(resolve => {
                            mysql.query('select * from tbl_Users where email=?', [email], resp => {
                                let result = null;
                                if (!_.isNull(resp)) {
                                    result = resp;
                                    delete result.password;
                                }
                                resolve(result);
                            })
                        });

                        if (exist && _.size(exist) === 0) {
                            const date = new Date();
                            const password = await bcrypt.hashSync(username, _bcrypt.saltRounds);

                            await new Promise(resolve => {
                                const str = 'insert into tbl_Users (userId, username, password, email, status, fullName, createdDate) values ?';
                                mysql.query(str, [[[email, username, password, email, 1, user.name, date]]], resp => {
                                    if (!_.isNull(resp) && resp.affectedRows === 1) {
                                        result = {
                                            userId: email,
                                            email: email,
                                            username: username,
                                            status: 1,
                                            fullName: fullName,
                                            createdDate: date
                                        }
                                    }
                                    resolve(true);
                                })
                            });

                        } else {
                            if (_.size(exist) > 0) {
                                result = exist[0];
                            }
                        }

                        let permission = await middleware.checkPermission(email);

                        result = {...result, permission};

                        value.passport.user = result;
                        await redis.set(sess, JSON.stringify(value));
                    } else {
                        result = user;
                        if (!user.permission || _.size(user.permission) === 0) {
                            let permission = await middleware.checkPermission(email);

                            result = {...result, permission};
                            value.passport.user = result;
                            await redis.set(sess, JSON.stringify(value));
                        }
                    }
                    // const passport = value.passport;
                    // let ss_auth_user = {}; // session auth
                    // const session = req.session || {};
                    // let ss_app_user = session.user || {};  // session app
                    //
                    // if(passport) {
                    //     ss_auth_user = passport.user || {};
                    // } else {
                    //     ss_auth_user = value.user || {};
                    // }
                    //
                    // const userId = ss_app_user.userId;
                    // const email = ss_auth_user.email;
                    // const username = ss_auth_user.username;
                    // const fullName = ss_auth_user.fullName;
                    //
                    // // chua co id thi get trong db
                    // if(!userId) {
                    //     let exist = await new Promise(resolve => {
                    //         mysql.query('select * from tbl_Users where email=?', [email], resp => {
                    //             let result = null;
                    //             if(!_.isNull(resp)) {
                    //                 result = resp;
                    //                 delete result.password;
                    //             }
                    //             resolve(result);
                    //         })
                    //     });
                    //
                    //     if(exist && _.size(exist) === 0) {
                    //         const date = new Date();
                    //         const password = await bcrypt.hashSync(username, _bcrypt.saltRounds);
                    //
                    //         ss_app_user = await new Promise(resolve => {
                    //             const str = 'insert into tbl_Users (userId, username, password, email, status, fullName, createdDate) values ?';
                    //             mysql.query(str, [[[email, username, password, email, 1, fullName, date]]], resp => {
                    //                 let temp = {};
                    //                 if(!_.isNull(resp) && resp.affectedRows === 1) {
                    //                     temp = {
                    //                         userId: email,
                    //                         email: email,
                    //                         username: username,
                    //                         status: 1,
                    //                         fullName: fullName,
                    //                         createdDate: date
                    //                     }
                    //                 }
                    //                 resolve(temp);
                    //             })
                    //         });
                    //
                    //     } else {
                    //         if(_.size(exist) > 0) {
                    //             ss_app_user = exist[0];
                    //             delete ss_app_user.password;
                    //         }
                    //     }
                    //
                    //     let permission = await middleware.checkPermission(email);
                    //
                    //     // session server app
                    //     result = { ...ss_app_user, permission };
                    //     req.session.user = {};
                    //     req.session.user = result;
                    // } else {
                    //     result = ss_app_user;
                    // }
                }
            }
        }
    } catch (error) {
        elk.error({
            controller: 'base-controller',
            function: 'getSession',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: {
                name: name
            }
        });
    }

    return result;
}

function getToken(req, name) {
    name = name ? name : 'x-access-token';
    const body = req.body || {};
    const query = req.query || {};
    const headers = req.headers || {};
    let result = body[name] || query[name] || headers[name] || '';
    result = result ? result : (headers['x-access-token'] || '');
    return result;
}

function getAddress(req) {
    return {
        ip: req.ip,
        ips: req.ips
    }
}

function validStringNotSpecical(str) {
    str.replace(/-{2,}/gm, '-');
    const regex = new RegExp(/^[\w- ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/);
    return regex.test(str);
}

function validPassword(str) {
    const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}/);
    return regex.test(str);
}

function validPassword2(str) {
    const regex = new RegExp(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,32}/);
    return regex.test(str);
}

function validName(str) {
    const regex = new RegExp(/^[a-zA-Z ÀÁÂÃĂẠẢẤẦẨẪẬẮẰẲẴẶàáâãăạảấầẩẫậắằẳẵặĐđÈÉÊẸẺẼỀẾỀỂỄỆèéêếẹẻẽềềểễệÌÍĨỈỊìíĩỉịÒÓÔÕỌỎỐỒỔỖỘỚỜƠỞỠỢòóôõọỏốồổỗộơớờởỡợÙÚŨƯỤỦỨỪỬỮỰùúũưụủứừửữựỲỴÝỶỸỳỵỷỹ]+$/);
    return regex.test(str);
}

function validUsername(str) {
    const regex = new RegExp(/^[a-zA-Z_0-9]+$/);
    return regex.test(str);
}

function subString(str) {
    str = str.trim().replace(/\s{2,}/g, ' ');
    const arr = str.split(' ');
    let result = [];
    _.forEach(arr, value => {
        result.push(value.replace(/^[a-zÀÁÂÃĂẠẢẤẦẨẪẬẮẰẲẴẶàáâãăạảấầẩẫậắằẳẵặĐđÈÉÊẸẺẼỀẾỀỂỄỆèéêếẹẻẽềềểễệÌÍĨỈỊìíĩỉịÒÓÔÕỌỎỐỒỔỖỘỚỜƠỞỠỢòóôõọỏốồổỗộơớờởỡợÙÚŨƯỤỦỨỪỬỮỰùúũưụủứừửữựỲỴÝỶỸỳỵỷỹ]/, value.charAt(0).toLocaleUpperCase()));
    });
    return result.join(' ');
}

function validEmail(str) {
    const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regex.test(str);
}

function validEmailFPT(str) {
    const regex = new RegExp(/^([a-zA-Z0-9_.]{3,})@(fpt.com.vn)$/);
    return regex.test(str);
}

function validNumber(str) {
    const regex = new RegExp(/^\d.+$/);
    return regex.test(str);
}

function validDate(str, format) {
    if (format) {
        return moment(str).isValid();
    } else {
        return moment(str, format).isValid();
    }
}

function validString(str) {
    if (typeof str === "string") {
        return str.trim() !== "";
    }
    return false;
}

function validLength(value, length) {
    if (value.length >= length) {
        return true;
    }
    return false;
}

function getPermissions(pathname) {
    let permissions = localStorage.getItem('permissions');
    permissions = _.isString(permissions) ? JSON.parse(permissions) : permissions;
    let obj = _.find(permissions, {routeKey: pathname});
    if (obj) obj.operations = ['view', 'insert', 'update', 'delete']; // namld9 tam fix
    return obj ? obj.operations : null;
}

function bodauTiengViet(str) {
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    return str;
}

function isNumber(number) {
    return number && !isNaN(number);
}

module.exports = {
    getSession,
    getToken,
    getAddress,
    validStringNotSpecical,
    validPassword,
    validPassword2,
    validName,
    validUsername,
    subString,
    validEmail,
    validEmailFPT,
    validNumber,
    validDate,
    validString,
    validLength,
    getPermissions,
    bodauTiengViet,
    isNumber
};