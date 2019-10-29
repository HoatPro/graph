const _config = require('../../configs/session-config');
const config = _config[_config.environment];

function index(req, res) {

    try {
        const session  = req.session || {};
        const passport = session.passport || {};
        const token = session.id || '';
        let url = config.originFrontend;
        const redirect = session.authRedirect;
        // console.log('authRedirect', redirect);
        res.cookie('authtoken', token);
        if(redirect) {
            url = redirect;
            delete req.session.authRedirect;
            res.redirect(url);
        } else {
            res.render('pages/index', {
                user: passport.user,
                url: url + '?token=' + token,
                token: token,
                env: _config.environment
            });
        }

    } catch (error) {
        res.render('pages/index');
    }
 }

function getCookies(req) {
    const headers = req.headers;
    const cookie = headers.cookie || '';
    let result = {};
    if(cookie) {
        const arr = cookie.split(';');
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            if(item.indexOf('=') > -1) {
                const split = item.split('=');
                result[split[0]] = split[1];
            }
        }
    }
    return result;
}

async function logout(req, res) {
    const destroy = await destroySession(req);
    // https://login.fpt.com.vn/adfs/oauth2/logout
    res.redirect('/openid');
}

function destroySession(req) {
    return new Promise(resolve => {
        req.session.destroy(function (err) {
            let result = null;
            if(err) {
                elk.error({
                    controller: 'auth-controller',
                    function: 'destroySession',
                    error: err,
                    data: {}
                });
            } else {
                result = '/openid';
            }
            resolve(result);
        });
    })
}


module.exports = {
    index,
    logout,
};