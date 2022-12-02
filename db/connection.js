const mysql = require("mysql2");

const pool = mysql.createPool({
  host: ${{secrets.DATABASE_HOST}},
  user: ${{secrets.DATABASE_USER}},
  password: ${{secrets.DATABASE_PASSWORD}},
  database: ${{secrets.DATABASE_NAME}},
});
module.exports = pool.promise();
