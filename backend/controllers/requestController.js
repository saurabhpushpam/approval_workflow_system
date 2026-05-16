const db = require("../config/db");

const validRequestTypes = ["Leave", "Expense", "General"];
const validStatuses = ["Pending", "Approved", "Rejected"];
const validUpdateStatuses = ["Approved", "Rejected"];

exports.createRequest = async (req, res) => {
  try {
    const { title, description, requestType } = req.body;
    const userId = req.user.id;

    if (!title || !description || !requestType) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!validRequestTypes.includes(requestType)) {
      return res.status(400).json({
        message: "Request type must be Leave, Expense, or General",
      });
    }

    const sql = `
      INSERT INTO requests
      (title, description, requested_by, request_type)
      VALUES (?, ?, ?, ?)
    `;

    await db.execute(sql, [title, description, userId, requestType]);

    res.status(201).json({
      message: "Request Created Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const { status, requestType } = req.query;
    const user = req.user;

    let sql = `
      SELECT
        requests.id,
        requests.title,
        requests.description,
        requests.request_type AS requestType,
        requests.status,
        requests.created_at,
        users.id AS requestedBy,
        users.name AS requestedByName
      FROM requests
      JOIN users ON requests.requested_by = users.id
      WHERE 1=1
    `;

    const values = [];

    if (user.role === "User") {
      sql += ` AND requests.requested_by = ?`;
      values.push(user.id);
    }

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status filter",
        });
      }
      sql += ` AND requests.status = ?`;
      values.push(status);
    }

    if (requestType) {
      if (!validRequestTypes.includes(requestType)) {
        return res.status(400).json({
          message: "Invalid request type filter",
        });
      }
      sql += ` AND requests.request_type = ?`;
      values.push(requestType);
    }

    sql += ` ORDER BY requests.id DESC`;

    const [rows] = await db.execute(sql, values);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !validUpdateStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected",
      });
    }

    const [requests] = await db.execute("SELECT * FROM requests WHERE id = ?", [
      id,
    ]);

    if (requests.length === 0) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const request = requests[0];

    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "Request already finalized",
      });
    }

    await db.execute("UPDATE requests SET status = ? WHERE id = ?", [
      status,
      id,
    ]);

    res.json({
      message: `Request ${status}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
