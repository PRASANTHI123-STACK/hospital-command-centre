const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    patientId: {
      type: String,
      required: true,
      trim: true,
    },

    doctorId: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
      trim: true,
    },

    appointmentType: {
      type: String,
      enum: [
        "Consultation",
        "Follow-up",
        "Emergency",
        "Pre-Procedure",
        "Review",
      ],
      default: "Consultation",
    },

    room: {
      type: String,
      trim: true,
    },

    reason: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Confirmed",
        "Waiting",
        "In Progress",
        "Completed",
        "Cancelled",
        "Urgent",
      ],
      default: "Scheduled",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

module.exports = Appointment;