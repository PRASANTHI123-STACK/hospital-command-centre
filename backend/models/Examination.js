
const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema(
  {
    examinationId: {
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

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    doctorName: {
      type: String,
      required: true,
      trim: true,
    },

    doctorId: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    examinedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    heartRate: {
      type: Number,
      min: 1,
      max: 300,
      default: null,
    },

    bloodPressure: {
      type: String,
      default: "",
      trim: true,
    },

    oxygenSaturation: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    temperature: {
      type: Number,
      default: null,
    },

    temperatureUnit: {
      type: String,
      enum: ["C", "F"],
      default: "C",
    },

    symptoms: {
      type: String,
      default: "",
      trim: true,
    },

    clinicalFindings: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    recordedBy: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Recorded", "Reviewed"],
      default: "Recorded",
    },
  },
  {
    timestamps: true,
  }
);

examinationSchema.index({
  patientId: 1,
  examinedAt: -1,
});

module.exports = mongoose.model(
  "Examination",
  examinationSchema
);
