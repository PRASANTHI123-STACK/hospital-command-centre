const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    room: {
      type: String,
      trim: true,
    },

    heartRate: {
      type: Number,
    },

    bloodPressure: {
      type: String,
    },

    oxygenSaturation: {
      type: Number,
    },

    temperature: {
      type: Number,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High", "Severe"],
      default: "Low",
    },

    status: {
      type: String,
      enum: [
        "Stable",
        "Monitoring",
        "Critical",
        "Discharged",
      ],
      default: "Stable",
    },

    doctor: {
  type: String,
  trim: true,
},

doctorId: {
  type: String,
  trim: true,
  default: null,
  index: true,
},
    symptoms: {
      type: String,
    },

    // ================================
    // PATIENT LOGIN
    // ================================

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      default: "patient",
      enum: ["patient"],
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model(
  "Patient",
  patientSchema
);

module.exports = Patient;
