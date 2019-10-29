const Mysql = require('../mysql-connector');
const _var = require('../../../utils/var');

function insertOperation() {
    const db = new Mysql();
    const date = new Date();
    const data = [
        ["View", "view", "", 1, date],
        ["Insert", "insert", "", 1, date],
        ["Update", "update", "", 1, date],
        ["Delete", "delete", "", 1, date],
    ];
    const query = `insert into tbl_Operations (operationName, operationKey, description, status, createdDate)
                    values ?`;
    db._query(query, [data], function (err, resp) {
        console.log(err, resp);
    })
}

insertOperation();