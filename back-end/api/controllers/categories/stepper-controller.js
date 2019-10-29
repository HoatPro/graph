const _var = require('../../../../commons/utils/var');
const elk = require('../../../../commons/databases/elasticsearch/facade/elastic-facade');

function getStepper(req, res) {
    const query = req.query;
    try {
        const name = query.name;
        const stepper = _var.steppers[name];
        res.json({
            status: 200,
            data: stepper
        })
    } catch (error) {
        elk.error({
            controller: 'stepper-controller',
            function: 'getStepper',
            error: {
                message: error.message,
                stack: error.stack
            },
            data: query
        });
        res.json({
            status: 500,
            message: "Get stepper failed!"
        });
    }
}

module.exports = {
    getStepper
};