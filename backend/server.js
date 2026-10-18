const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
console.log("JWT_SECRET loaded:", Boolean(process.env.JWT_SECRET));

const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const authRoutes = require("./routes/authRoutes");
const medicalReportRoutes = require("./routes/medicalReportRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const examinationRoutes = require("./routes/examinationRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Patient routes
app.use("/api/patients", patientRoutes);

// Doctor routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", medicalReportRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/examinations", examinationRoutes);
app.use("/api/users/auth", userAuthRoutes);
app.use("/api/auth", authRoutes);


// Test API
app.get("/", (req, res) => {
  res.json({
    message: "AI Hospital Command Centre Backend is running",
    status: "success",
    database: "MongoDB",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});