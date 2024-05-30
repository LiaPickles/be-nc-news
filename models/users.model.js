const db = require("../db/connection");

const selectUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(({ rows }) => {
        return rows
    })
}



module.exports = { selectUsers }