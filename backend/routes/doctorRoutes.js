
const express = require("express");

const {
  createDoctor,
  getDoctors,
} = require("../controllers/doctorController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/doctors
// Only authenticated admins can create doctors and linked login accounts.
router.post(
  "/",
  protect,
  authorize("admin"),
  createDoctor
);

// GET /api/doctors
router.get("/", getDoctors);

module.exports = router;
