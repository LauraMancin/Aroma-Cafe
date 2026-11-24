const mysql = require('mysql2/promise');
require('dotenv').config();
 
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123abc',
  database: process.env.DB_NAME || 'tccaromacafe', //[span_1](start_span)[span_1](end_span)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
 
module.exports = pool;