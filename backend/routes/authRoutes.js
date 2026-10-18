const express = require("express");

const {
  patientLogin,
  createPatientLogin,
} = require("../controllers/authController");

const router = express.Router();

// Patient login
router.post("/patient/login", patientLogin);

// Create patient login account
router.post(
  "/patient/create-login",
  createPatientLogin
);

module.exports = router;