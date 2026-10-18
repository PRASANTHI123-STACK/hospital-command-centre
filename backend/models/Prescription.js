
const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    prescriptionId: {
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

    doctorId: {
      type: String,
      default: "",
      trim: true,
    },

    doctorName: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    medicines: [
      {
        medicineName: {
          type: String,
          required: true,
          trim: true,
        },

        dosage: {
          type: String,
          required: true,
          trim: true,
        },

        frequency: {
          type: String,
          required: true,
          trim: true,
        },

        duration: {
          type: String,
          required: true,
          trim: true,
        },

        instructions: {
          type: String,
          default: "",
          trim: true,
        },
      },
    ],

    diagnosis: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    prescribedDate: {
      type: Date,
      default: Date.now,
    },

    validUntil: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Prescription",
  prescriptionSchema
);
