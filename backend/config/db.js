const mysql = require("mysql2/promise");

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(poolConfig);
  }

  return pool;
}

async function execute(...args) {
  const connection = getPool();
  return connection.execute(...args);
}

async function query(...args) {
  const connection = getPool();
  return connection.query(...args);
}

module.exports = {
  getPool,
  execute,
  query,
};
