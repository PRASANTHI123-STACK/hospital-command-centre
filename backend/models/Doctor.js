const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
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

    department: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      trim: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    room: {
      type: String,
      trim: true,
    },

    shift: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Available", "Busy", "On Leave", "Offline"],
      default: "Available",
    },

    patientsAssigned: {
      type: Number,
      default: 0,
    },

    appointmentsToday: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;