require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

async function createUser() {
  const username = process.env.BOOTSTRAP_USERNAME?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_PASSWORD;
  const role = process.env.BOOTSTRAP_ROLE;
  const doctorId = process.env.BOOTSTRAP_DOCTOR_ID?.trim();

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from backend/.env");
  }

  if (!username || !password || !role) {
    throw new Error(
      "Set BOOTSTRAP_USERNAME, BOOTSTRAP_PASSWORD, and BOOTSTRAP_ROLE first."
    );
  }

  if (!["doctor", "admin", "staff"].includes(role)) {
    throw new Error("Role must be doctor, admin, or staff.");
  }

  if (password.length < 12) {
    throw new Error("Use a password with at least 12 characters.");
  }

  if (role === "doctor" && !doctorId) {
    throw new Error("BOOTSTRAP_DOCTOR_ID is required for a doctor account.");
  }

  if (role !== "doctor" && doctorId) {
    throw new Error("Only doctor accounts should have a doctor ID.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    throw new Error("That username already exists. No account was changed.");
  }

  if (role === "doctor") {
    const doctor = await Doctor.findOne({ doctorId });

    if (!doctor) {
      throw new Error(`Doctor record ${doctorId} was not found.`);
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    username,
    password: hashedPassword,
    role,
    doctorId: role === "doctor" ? doctorId : null,
    isActive: true,
  });

  console.log("Account created successfully.");
  console.log(`Username: ${user.username}`);
  console.log(`Role: ${user.role}`);

  if (user.doctorId) {
    console.log(`Linked doctor ID: ${user.doctorId}`);
  }
}

createUser()
  .catch((error) => {
    console.error("Account setup failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });