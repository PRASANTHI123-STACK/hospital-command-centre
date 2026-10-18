
const express = require("express");

const {
  getPatientReports,
  createMedicalReport,
} = require("../controllers/medicalReportController");

const router = express.Router();

router.get("/patient/:patientId", getPatientReports);

// For authorized staff to add a report.
// Authentication/authorization should be added before production use.
router.post("/", createMedicalReport);

module.exports = router;
