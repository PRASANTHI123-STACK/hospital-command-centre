
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Prescription = require("../models/Prescription");

// ==========================================
// GET PATIENT PRESCRIPTIONS
// ==========================================
const getPatientPrescriptions = async (req, res) => {
  try {
    const requestedPatientId = req.params.patientId;
    const authenticatedPatientId = req.patient?.patientId;

    // Verify patient authentication
    if (!authenticatedPatientId) {
      return res.status(401).json({
        success: false,
        message: "Patient authentication required.",
      });
    }

    // Verify that patients can access only their own records
    if (requestedPatientId !== authenticatedPatientId) {
      return res.status(403).json({
        success: false,
        message: "You can access only your own prescriptions.",
      });
    }

    // Confirm patient exists
    const patient = await Patient.findOne({
      patientId: authenticatedPatientId,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Retrieve prescriptions belonging to this patient
    const prescriptions = await Prescription.find({
      patientId: authenticatedPatientId,
    }).sort({ prescribedDate: -1 });

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    console.error(
      "Get patient prescriptions error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve prescriptions.",
    });
  }
};

// ==========================================
// CREATE PRESCRIPTION
// Only authenticated doctors should reach
// this controller through the protected route.
// ==========================================
const createPrescription = async (req, res) => {
  try {
    const {
      prescriptionId,
      patientId,
      doctorId,
      medicines,
      diagnosis,
      notes,
      prescribedDate,
      validUntil,
      status,
    } = req.body;

    // Validate required fields
    if (
      !patientId ||
      !Array.isArray(medicines) ||
      medicines.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and at least one medicine are required.",
      });
    }

    // Get doctor identity from the authenticated session
    const authenticatedDoctorId = req.user?.doctorId;

    if (!authenticatedDoctorId) {
      return res.status(403).json({
        success: false,
        message: "Authenticated doctor profile not found.",
      });
    }

    // Confirm patient exists
    const patient = await Patient.findOne({
      patientId: String(patientId).trim(),
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Confirm the authenticated doctor exists
    const doctor = await Doctor.findOne({
      doctorId: authenticatedDoctorId,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found.",
      });
    }

    // Validate medicine fields
    const validMedicines = medicines.every(
      (medicine) =>
        medicine &&
        typeof medicine.medicineName === "string" &&
        medicine.medicineName.trim() &&
        typeof medicine.dosage === "string" &&
        medicine.dosage.trim() &&
        typeof medicine.frequency === "string" &&
        medicine.frequency.trim() &&
        typeof medicine.duration === "string" &&
        medicine.duration.trim()
    );

    if (!validMedicines) {
      return res.status(400).json({
        success: false,
        message:
          "Every medicine must include its name, dosage, frequency and duration.",
      });
    }

    // Build prescription using the authenticated doctor's identity.
    // Do not trust doctorName or doctorId supplied by the frontend.
    const prescription = new Prescription({
      prescriptionId:
        prescriptionId ||
        `RX-${Date.now()}-${Math.floor(Math.random() * 10000)}`,

      patientId: patient.patientId,
      doctorId: doctor.doctorId,
      doctorName: doctor.name,
      department: doctor.department || "",

      medicines: medicines.map((medicine) => ({
        medicineName: medicine.medicineName.trim(),
        dosage: medicine.dosage.trim(),
        frequency: medicine.frequency.trim(),
        duration: medicine.duration.trim(),
        instructions: medicine.instructions || "",
      })),

      diagnosis: diagnosis || "",
      notes: notes || "",
      prescribedDate: prescribedDate || new Date(),
      validUntil: validUntil || null,

      // Default to Active; validate explicitly supplied statuses.
      status: status || "Active",
    });

    await prescription.save();

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully.",
      prescription,
    });
  } catch (error) {
    console.error(
      "Create prescription error:",
      error.message
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Prescription ID already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create prescription.",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
  getPatientPrescriptions,
  createPrescription,
};
