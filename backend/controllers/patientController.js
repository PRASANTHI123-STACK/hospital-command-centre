

const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// ==========================================
// CREATE A NEW PATIENT
// POST /api/patients
// ==========================================
const createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const savedPatient = await patient.save();

    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient: savedPatient,
    });
  } catch (error) {
    console.error("Create patient error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL PATIENTS
// GET /api/patients
// ==========================================
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Get patients error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve patients.",
    });
  }
};

// ==========================================
// GET PATIENTS ASSIGNED TO LOGGED-IN DOCTOR
// GET /api/patients/assigned/doctor
// Requires authenticated doctor
// ==========================================
const getDoctorPatients = async (req, res) => {
  try {
    // Use doctor identity from the verified JWT middleware.
    if (
      !req.user ||
      req.user.role !== "doctor" ||
      !req.user.doctorId
    ) {
      return res.status(403).json({
        success: false,
        message: "A linked doctor account is required.",
      });
    }

    // Resolve the authenticated doctor's profile.
    const doctor = await Doctor.findOne({
      doctorId: req.user.doctorId,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found.",
      });
    }

    // Find appointments assigned to this doctor.
    const appointments = await Appointment.find({
      doctorId: doctor.doctorId,
    })
      .select("patientId")
      .lean();

    const appointmentPatientIds = appointments
      .map((appointment) => appointment.patientId)
      .filter(Boolean)
      .map(String);

    // Also include patients directly assigned to this doctor.
    const directPatients = await Patient.find({
      doctorId: doctor.doctorId,
    })
      .select("patientId")
      .lean();

    const directPatientIds = directPatients
      .map((patient) => patient.patientId)
      .filter(Boolean)
      .map(String);

    // Combine IDs and remove duplicates.
    const patientIds = [
      ...new Set([
        ...appointmentPatientIds,
        ...directPatientIds,
      ]),
    ];

    if (patientIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        patients: [],
      });
    }

    // Return only patients assigned to this doctor.
    const patients = await Patient.find({
      patientId: { $in: patientIds },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error(
      "Get doctor patients error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve assigned patients.",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
  createPatient,
  getPatients,
  getDoctorPatients,
};
