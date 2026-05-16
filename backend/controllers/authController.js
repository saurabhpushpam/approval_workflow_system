const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validRoles = ["User", "Manager"];

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Role must be User or Manager",
      });
    }

    const checkUserSql = "SELECT id FROM users WHERE email = ?";
    const [existingUsers] = await db.execute(checkUserSql, [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertSql = `
      INSERT INTO users
      (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    await db.execute(insertSql, [name, email, hashedPassword, role]);

    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(sql, [email]);

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
