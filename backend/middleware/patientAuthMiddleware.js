const jwt = require("jsonwebtoken");

const protectPatient = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Patient authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "hospital-command-centre",
      audience: "hospital-command-centre-app",
    });

    if (decoded.role !== "patient" || !decoded.patientId) {
      return res.status(403).json({
        success: false,
        message: "Patient account required.",
      });
    }

    req.patient = {
      patientId: decoded.patientId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Patient session is invalid or expired. Please log in again.",
    });
  }
};

module.exports = { protectPatient };