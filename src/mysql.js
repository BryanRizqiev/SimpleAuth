import mysql from 'mysql2'

const conn = mysql.createPool({
    host: '103.171.85.233',
    user: 'bryan1',
    password: '${Password12345678}',
    database: 'ParkirDB'
})

export default conn