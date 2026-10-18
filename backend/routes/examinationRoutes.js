const express = require("express");

const {
  createExamination,
  getPatientExaminations,
} = require("../controllers/examinationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Only authenticated doctors can record examinations.
router.post(
  "/",
  protect,
  authorize("doctor"),
  createExamination
);

// Only authenticated users with permitted roles can request examination history.
// Patient ownership checks must also be enforced in the controller.
router.get(
  "/patient/:patientId",
  protect,
  authorize("doctor", "admin", "staff"),
  getPatientExaminations
);

module.exports = router;