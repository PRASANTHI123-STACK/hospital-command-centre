
const Examination = require("../models/Examination");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const ACTIVE_APPOINTMENT_STATUSES = [
  "Scheduled",
  "Confirmed",
  "Waiting",
  "In Progress",
  "Urgent",
];

// ==========================================
// CREATE EXAMINATION — ASSIGNED DOCTOR ONLY
// ==========================================
const createExamination = async (req, res) => {
  try {
    // The authenticated doctor identity must come from the verified JWT.
    if (req.user?.role !== "doctor" || !req.user.doctorId) {
      return res.status(403).json({
        success: false,
        message: "An authenticated, linked doctor account is required.",
      });
    }

    const {
      patientId,
      examinedAt,
      heartRate,
      bloodPressure,
      oxygenSaturation,
      temperature,
      temperatureUnit,
      symptoms,
      clinicalFindings,
      notes,
    } = req.body;

    if (typeof patientId !== "string" || !patientId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required.",
      });
    }

    const [doctor, patient] = await Promise.all([
      Doctor.findOne({ doctorId: req.user.doctorId }),
      Patient.findOne({ patientId: patientId.trim() }),
    ]);

    if (!doctor) {
      return res.status(403).json({
        success: false,
        message: "Linked doctor record was not found.",
      });
    }

    if (["On Leave", "Offline"].includes(doctor.status)) {
      return res.status(403).json({
        success: false,
        message: "This doctor cannot record examinations while inactive.",
      });
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Verify that this patient has an active appointment with
    // the authenticated doctor.
    const assignedAppointment = await Appointment.findOne({
      patientId: patient.patientId,
      doctorId: doctor.doctorId,
      status: { $in: ACTIVE_APPOINTMENT_STATUSES },
    });

    if (!assignedAppointment) {
      return res.status(403).json({
        success: false,
        message:
          "This patient does not have an active appointment with your doctor account.",
      });
    }

    // Validate examination date and time.
    const parsedDate = examinedAt ? new Date(examinedAt) : new Date();

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.getTime() > Date.now() + 60_000
    ) {
      return res.status(400).json({
        success: false,
        message: "Examination date must be valid and cannot be in the future.",
      });
    }

    const optionalNumber = (value) => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }

      const number = Number(value);
      return Number.isFinite(number) ? number : NaN;
    };

    const parsedHeartRate = optionalNumber(heartRate);
    const parsedOxygen = optionalNumber(oxygenSaturation);
    const parsedTemperature = optionalNumber(temperature);

    if (
      Number.isNaN(parsedHeartRate) ||
      Number.isNaN(parsedOxygen) ||
      Number.isNaN(parsedTemperature)
    ) {
      return res.status(400).json({
        success: false,
        message: "Vital measurements must be valid numbers.",
      });
    }

    if (
      (parsedHeartRate !== null &&
        (parsedHeartRate < 1 || parsedHeartRate > 300)) ||
      (parsedOxygen !== null &&
        (parsedOxygen < 0 || parsedOxygen > 100))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Heart rate or oxygen saturation is outside the accepted input range.",
      });
    }

    if (
      parsedTemperature !== null &&
      (parsedTemperature < -50 || parsedTemperature > 150)
    ) {
      return res.status(400).json({
        success: false,
        message: "Temperature is outside the accepted input range.",
      });
    }

    if (
      temperatureUnit !== undefined &&
      !["C", "F"].includes(temperatureUnit)
    ) {
      return res.status(400).json({
        success: false,
        message: "Temperature unit must be C or F.",
      });
    }

    if (
      bloodPressure !== undefined &&
      typeof bloodPressure !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Blood pressure must be provided as text.",
      });
    }

    // Always record the authenticated doctor, not a name from the form.
    const newExamination = new Examination({
      examinationId: `EX-${Date.now()}-${Math.floor(
        Math.random() * 100000
      )}`,
      patientId: patient.patientId,
      patientName: patient.name,
      doctorName: doctor.name,
      doctorId: doctor.doctorId,
      department: doctor.department,
      recordedBy: doctor.name,
      examinedAt: parsedDate,
      heartRate: parsedHeartRate,
      bloodPressure: bloodPressure?.trim() || "",
      oxygenSaturation: parsedOxygen,
      temperature: parsedTemperature,
      temperatureUnit: temperatureUnit || "C",
      symptoms: typeof symptoms === "string" ? symptoms.trim() : "",
      clinicalFindings:
        typeof clinicalFindings === "string"
          ? clinicalFindings.trim()
          : "",
      notes: typeof notes === "string" ? notes.trim() : "",
      status: "Recorded",
    });

    const savedExamination = await newExamination.save();

    return res.status(201).json({
      success: true,
      message: "Examination saved successfully.",
      examination: savedExamination,
    });
  } catch (error) {
    console.error("Create examination error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Examination ID already exists.",
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
      message: "Unable to save examination.",
    });
  }
};

// ==========================================
// GET PATIENT EXAMINATION HISTORY
// ==========================================
const getPatientExaminations = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required.",
      });
    }

    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Doctors can access history only if the patient has an
    // appointment with that doctor or the patient is assigned to them.
    if (req.user?.role === "doctor") {
      if (!req.user.doctorId) {
        return res.status(403).json({
          success: false,
          message: "Authenticated doctor is not linked to a doctor record.",
        });
      }

      const doctor = await Doctor.findOne({
        doctorId: req.user.doctorId,
      });

      if (!doctor) {
        return res.status(403).json({
          success: false,
          message: "Linked doctor record was not found.",
        });
      }

      const [appointment, existingAssignment] = await Promise.all([
        Appointment.findOne({
          patientId: patient.patientId,
          doctorId: doctor.doctorId,
          status: { $ne: "Cancelled" },
        }),
        Patient.exists({
          patientId: patient.patientId,
          doctorId: doctor.doctorId,
        }),
      ]);

      if (!appointment && !existingAssignment) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to access this patient's examination history.",
        });
      }
    }

    const examinations = await Examination.find({
      patientId: patient.patientId,
    }).sort({ examinedAt: -1 });

    return res.status(200).json({
      success: true,
      count: examinations.length,
      examinations,
    });
  } catch (error) {
    console.error("Get examinations error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve examinations.",
    });
  }
};

module.exports = {
  createExamination,
  getPatientExaminations,
};
