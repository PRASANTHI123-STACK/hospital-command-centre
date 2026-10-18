
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Doctor = require("../models/Doctor");
const User = require("../models/User");

// ==========================================
// CREATE DOCTOR + LOGIN ACCOUNT
// ==========================================
const createDoctor = async (req, res) => {
  let savedDoctor = null;

  try {
    const {
      doctorId,
      name,
      department,
      specialization,
      qualification,
      experience,
      phone,
      email,
      room,
      shift,
      status,
    } = req.body;

    // Validate required doctor information.
    if (
      !doctorId?.trim() ||
      !name?.trim() ||
      !department?.trim() ||
      !specialization?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor ID, name, department, and specialization are required.",
      });
    }

    const normalizedDoctorId = doctorId.trim();

    // Each doctor gets a predictable username, not a shared password.
    const username = normalizedDoctorId.toLowerCase();

    // Prevent duplicate doctor or login records.
    const [existingDoctor, existingUser] = await Promise.all([
      Doctor.findOne({ doctorId: normalizedDoctorId }),
      User.findOne({
        $or: [
          { username },
          { doctorId: normalizedDoctorId },
        ],
      }),
    ]);

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "This doctor ID already exists.",
      });
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "A login account already uses this username or doctor ID.",
      });
    }

    // Create the doctor profile.
    savedDoctor = await Doctor.create({
      doctorId: normalizedDoctorId,
      name: name.trim(),
      department: department.trim(),
      specialization: specialization.trim(),
      qualification,
      experience,
      phone,
      email,
      room,
      shift,
      status,
    });

    // Generate a unique initial password for this doctor.
    // It is returned only in this creation response.
    const temporaryPassword = crypto.randomBytes(18).toString("base64url");
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    try {
      await User.create({
        username,
        password: passwordHash,
        role: "doctor",
        doctorId: savedDoctor.doctorId,
        isActive: true,
      });
    } catch (accountError) {
      // Avoid leaving an unlinked doctor profile if account creation fails.
      await Doctor.deleteOne({ _id: savedDoctor._id });
      savedDoctor = null;
      throw accountError;
    }

    return res.status(201).json({
      success: true,
      message: "Doctor and linked login account created successfully.",
      doctor: savedDoctor,
      login: {
        username,
        temporaryPassword,
        message:
          "Provide these initial credentials securely to the doctor. Do not share or log the password publicly.",
      },
    });
  } catch (error) {
    console.error("Create doctor error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A doctor or login account with these details already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create doctor and login account.",
    });
  }
};

// ==========================================
// GET ALL DOCTORS
// ==========================================
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve doctors.",
    });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
};
