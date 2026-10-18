
const express = require("express");

const {
  getPatientPrescriptions,
  createPrescription,
} = require("../controllers/prescriptionController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const {
  protectPatient,
} = require("../middleware/patientAuthMiddleware");

const router = express.Router();

// ==========================================
// GET PATIENT PRESCRIPTIONS
// Only an authenticated patient can access
// their own prescriptions.
// ==========================================
router.get(
  "/patient/:patientId",
  protectPatient,
  getPatientPrescriptions
);

// ==========================================
// CREATE PRESCRIPTION
// Only authenticated doctors can create
// prescriptions.
// ==========================================
router.post(
  "/",
  protect,
  authorize("doctor"),
  createPrescription
);

module.exports = router;
