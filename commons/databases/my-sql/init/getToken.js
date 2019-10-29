const jwt = require('jsonwebtoken');
const _var = require('../../../utils/var');
const jsonwebtoken = _var.jwt;

function getToken() {
    const token = jwt.sign(jsonwebtoken.pageLoad, jsonwebtoken.secretAPI, { algorithm: jsonwebtoken.algorithms });
    console.log(token);
}

getToken();