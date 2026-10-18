
const express = require("express");

const {
  createPatient,
  getPatients,
  getDoctorPatients,
} = require("../controllers/patientController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE A PATIENT
// POST /api/patients
// ==========================================
router.post("/", createPatient);

// ==========================================
// GET ALL PATIENTS
// GET /api/patients
// Existing route retained for compatibility.
// ==========================================
router.get("/", getPatients);

// ==========================================
// GET ASSIGNED PATIENTS FOR LOGGED-IN DOCTOR
// GET /api/patients/assigned/doctor
// Requires a valid JWT and doctor role.
// ==========================================
router.get(
  "/assigned/doctor",
  protect,
  authorize("doctor"),
  getDoctorPatients
);

module.exports = router;
