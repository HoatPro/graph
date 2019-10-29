// controllers
const auth = require('../api/controllers/auth-controller');

function router(app, ssl) {

    app.get('/openid/index', (req, res, next) => {
        auth.index(req, res, next);
    });

    app.get('/openid/raca', (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, X-Auth-Token, Accept");
        res.redirect('http://localhost:3000');
        // auth.index(req, res, next);
    });

    app.get('/openid/set-session', (req, res, next) => {
        const data = {
            cookie: req.headers.cookie,
            headers: req.headers,
            body: req.body,
            query: req.query,
        };
        console.log(data);
        res.json(data);
    });

}

module.exports = router;