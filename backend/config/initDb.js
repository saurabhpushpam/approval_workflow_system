const mysql = require("mysql2/promise");
const db = require("./db");
const bcrypt = require("bcryptjs");

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  console.error(
    "Missing required DB environment variables. Please set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.",
  );
  process.exit(1);
}

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );

  await connection.end();
}

async function initializeDatabase() {
  try {
    await ensureDatabaseExists();

    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('User', 'Manager') DEFAULT 'User',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS requests (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        requested_by INT NOT NULL,
        request_type ENUM('Leave', 'Expense', 'General') NOT NULL,
        status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await seedDefaultUsers();
    await seedDefaultRequests();

    console.log("Database and tables are ready");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

async function seedDefaultUsers() {
  const defaultUsers = [
    {
      name: "Manager User",
      email: "manager@example.com",
      password: "Manager123!",
      role: "Manager",
    },
    {
      name: "Basic User",
      email: "user@example.com",
      password: "User123!",
      role: "User",
    },
  ];

  for (const user of defaultUsers) {
    const [rows] = await db.execute("SELECT id FROM users WHERE email = ?", [
      user.email,
    ]);

    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.execute(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [user.name, user.email, hashedPassword, user.role],
      );
      console.log(`Created default user: ${user.email}`);
    }
  }
}

async function seedDefaultRequests() {
  const [rows] = await db.execute("SELECT id FROM requests LIMIT 1");
  if (rows.length > 0) {
    return;
  }

  const [userRows] = await db.execute(
    "SELECT id, email FROM users WHERE email IN (?, ?)",
    ["manager@example.com", "user@example.com"],
  );

  const userMap = userRows.reduce((map, row) => {
    map[row.email] = row.id;
    return map;
  }, {});

  const sampleRequests = [
    {
      title: "Leave request for family event",
      description: "Need two days off for a family event next week.",
      requested_by: userMap["user@example.com"],
      request_type: "Leave",
      status: "Pending",
    },
    {
      title: "Office supplies reimbursement",
      description: "Request reimbursement for printer ink and stationery.",
      requested_by: userMap["user@example.com"],
      request_type: "Expense",
      status: "Pending",
    },
    {
      title: "General approval for new software",
      description: "Request approval to purchase team collaboration software.",
      requested_by: userMap["manager@example.com"],
      request_type: "General",
      status: "Approved",
    },
  ];

  for (const request of sampleRequests) {
    await db.execute(
      `INSERT INTO requests (title, description, requested_by, request_type, status) VALUES (?, ?, ?, ?, ?)`,
      [
        request.title,
        request.description,
        request.requested_by,
        request.request_type,
        request.status,
      ],
    );
  }

  console.log("Seeded default requests");
}

module.exports = initializeDatabase;
