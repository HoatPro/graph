const Request = require('request');
const headerDefault = {
    'User-Agent': 'request',
    'Content-Type': 'application/json',
};
const headerEncodedDefault = {
    'User-Agent': 'request',
    'Content-Type': 'application/x-www-form-urlencoded',
};

module.exports = {
    post: (url, body, callback, headers = {}) => {
        headers = {
            ...headers,
            ...headerDefault
        };
        // console.log(headers);
        Request({
            rejectUnauthorized: false,
            method: 'post',
            url,
            headers,
            body,
            json: true,
        }, (err, httpResponse, body) => {
            callback(err, httpResponse, body);
        });
    },
    postURLEncoded: (url, body, callback, headers = {}) => {
        headers = {
            ...headers,
            ...headerEncodedDefault
        };
        Request({
            method: 'post',
            url,
            headers,
            form: body,
        }, (err, httpResponse, body) => {
            callback(err, httpResponse, body);
        });
    },
    get: (url, qs = {}, callback) => {
        Request({
            method: 'get',
            url,
            json: true,
            qs,
        }, (err, httpResponse, body) => {
            callback(err, httpResponse, body);
        });
    }
};
