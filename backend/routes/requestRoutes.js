const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const {
  createRequest,
  getRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("User"),
  createRequest
);

router.get(
  "/",
  authMiddleware,
  getRequests
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("Manager"),
  updateRequestStatus
);

module.exports = router;