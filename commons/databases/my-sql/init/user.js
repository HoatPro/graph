const Mysql = require('../mysql-connector');
const jwt = require('jsonwebtoken');
const _var = require('../../../utils/var');
const admin = _var.user;
const jsonwebtoken = _var.jwt;

function insertUser() {
    const table = _var.tables.users;
    const db = new Mysql();
    const date = new Date();
    const password = jwt.sign({ password: admin.password }, jsonwebtoken.secret, { algorithm: jsonwebtoken.algorithms });
    const data = [admin.username, password , admin.email, date, admin.status, admin.email, admin.username];
    const query = `insert into ${table.name} (username, password, email, createdDate, status)
                    select * from(select ?, ?, ?, ?, ? ) as tmp
                    where not exists (
                        select email from ${table.name} where email = ? or username = ?
                    ) limit 1`;
    db._query(query, data, function (err, resp) {
        console.log(err, resp);
    })
}

insertUser();