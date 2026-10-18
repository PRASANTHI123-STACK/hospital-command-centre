const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

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

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured.",
      });
    }

    const user = await User.findOne({
      username: username.trim().toLowerCase(),
    }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    let doctor = null;

    if (user.role === "doctor") {
      if (!user.doctorId) {
        return res.status(403).json({
          success: false,
          message: "This doctor account is not linked to a doctor record.",
        });
      }

      doctor = await Doctor.findOne({
        doctorId: user.doctorId,
      }).select("doctorId name department specialization status");

      if (!doctor) {
        return res.status(403).json({
          success: false,
          message: "Linked doctor record was not found.",
        });
      }
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
        issuer: "hospital-command-centre",
        audience: "hospital-command-centre-app",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      expiresIn: 3600,
      user: {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
        ...(doctor
          ? {
              doctorId: doctor.doctorId,
              name: doctor.name,
              department: doctor.department,
              specialization: doctor.specialization,
              doctorStatus: doctor.status,
            }
          : {}),
      },
    });
  } catch (error) {
    console.error("User login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to complete login.",
    });
  }
};

module.exports = { userLogin };