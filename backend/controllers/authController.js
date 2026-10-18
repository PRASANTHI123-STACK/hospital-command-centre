
const bcrypt = require("bcryptjs");
const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");

// ==========================================
// PATIENT LOGIN
// ==========================================
const patientLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // Check JWT configuration
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured.",
      });
    }

    // Find patient by username
    const patient = await Patient.findOne({
      username: username.trim().toLowerCase(),
    });

    if (!patient || !patient.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      patient.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        patientId: patient.patientId,
        role: "patient",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
        issuer: "hospital-command-centre",
        audience: "hospital-command-centre-app",
      }
    );

    // Return successful login response
    return res.status(200).json({
      success: true,
      message: "Patient login successful",
      token,
      user: {
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        username: patient.username,
        role: "patient",
        department: patient.department,
        room: patient.room,
        doctor: patient.doctor,
      },
    });
  } catch (error) {
    console.error("Patient login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error during patient login.",
    });
  }
};

// ==========================================
// CREATE PATIENT LOGIN
// ==========================================
const createPatientLogin = async (req, res) => {
  try {
    const { patientId, username, password } = req.body;

    // Validate input
    if (
      typeof patientId !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      !patientId.trim() ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Patient ID, username and password are required.",
      });
    }

    // Basic password length validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    // Find patient
    const patient = await Patient.findOne({
      patientId: patientId.trim(),
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Check whether patient already has login
    if (patient.username) {
      return res.status(409).json({
        success: false,
        message: "This patient already has a login account.",
      });
    }

    // Normalize username
    const normalizedUsername = username.trim().toLowerCase();

    // Check whether username is already used
    const existingUsername = await Patient.findOne({
      username: normalizedUsername,
    });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username is already in use.",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    patient.username = normalizedUsername;
    patient.password = hashedPassword;
    patient.role = "patient";

    await patient.save();

    return res.status(201).json({
      success: true,
      message: "Patient login account created successfully.",
      user: {
        patientId: patient.patientId,
        name: patient.name,
        username: patient.username,
        role: "patient",
      },
    });
  } catch (error) {
    console.error("Create patient login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while creating patient login.",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
  patientLogin,
  createPatientLogin,
};
