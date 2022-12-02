const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "sql6.freesqldatabase.com",
  user: "sql6582394",
  password: "RyhKtYp7jR",
  database: "sql6582394",
});
module.exports = pool.promise();
