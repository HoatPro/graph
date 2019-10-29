const Mysql = require('../mysql-connector');
const _var = require('../../../utils/var');

function insertDepartments() {
    const table = _var.tables.departments;
    const columns = table.columns;
    const db = new Mysql();
    const date = new Date();
    const data = [
        ["View", "view", "", 1, date],
        ["Insert", "insert", "", 1, date],
        ["Update", "update", "", 1, date],
        ["Delete", "delete", "", 1, date],
    ];
    const query = `insert into ${table.name} (${columns.name}, ${columns.key}, ${columns.desc}, ${columns.createdDate})
                    values ?`;
    db._query(query, [data], function (err, resp) {
        console.log(err, resp);
    })
}

insertDepartments();