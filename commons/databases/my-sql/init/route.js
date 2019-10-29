const Mysql = require('../mysql-connector');
const _var = require('../../../utils/var');

function insertRoutes() {
    const table = _var.tables.routes;
    const columns = table.columns;
    const db = new Mysql();
    const date = new Date();
    const data = [
        ["Operations", "/operations", "", 1, date],
        ["Users", "/users", "", 1, date],
        ["Roles", "/racks", "", 1, date],
        ["Groups", "/groups", "", 1, date],
        ["Routes", "/routes", "", 1, date],
    ];
    const query = `insert into ${table.name} (${columns.name}, ${columns.key}, ${columns.desc}, ${columns.status}, ${columns.createdDate})
                    values ?`;
    db._query(query, [data], function (err, resp) {
        console.log(err, resp);
    })
}

insertRoutes();