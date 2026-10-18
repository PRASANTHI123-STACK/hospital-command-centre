
const express = require("express");

const {
  createAppointment,
  getAppointments,
  getPatientAppointments,
} = require("../controllers/appointmentController");

const router = express.Router();

// Patient's own appointment list
router.get("/patient/:patientId", getPatientAppointments);

// Create appointment
router.post("/", createAppointment);

// Staff appointment management
router.get("/", getAppointments);

module.exports = router;
