
const mongoose = require("mongoose");

const medicalReportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    patientId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    reportType: {
      type: String,
      default: "General Report",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    department: {
      type: String,
      default: "",
      trim: true,
    },
    reportDate: {
      type: Date,
      default: Date.now,
    },
    fileUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "MedicalReport",
  medicalReportSchema
);
