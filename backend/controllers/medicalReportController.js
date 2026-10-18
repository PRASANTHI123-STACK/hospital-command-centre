
const MedicalReport = require("../models/MedicalReport");

const getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required.",
      });
    }

    const reports = await MedicalReport.find({
      patientId: patientId,
    }).sort({ reportDate: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get patient reports error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve medical reports.",
    });
  }
};

const createMedicalReport = async (req, res) => {
  try {
    const report = new MedicalReport(req.body);
    const savedReport = await report.save();

    return res.status(201).json({
      success: true,
      message: "Medical report created successfully.",
      report: savedReport,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getPatientReports,
  createMedicalReport,
};
