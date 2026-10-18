
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const Patient = require("../models/Patient");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const username = "ramesh";

    const patient = await Patient.findOne({ username });

    if (!patient) {
      throw new Error(
        `Patient account '${username}' was not found.`
      );
    }

    const password = await ask(
      "Enter a new password for patient ramesh: "
    );

    if (password.length < 8) {
      throw new Error(
        "Password must contain at least 8 characters."
      );
    }

    const confirmPassword = await ask(
      "Confirm the new password: "
    );

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    patient.password = await bcrypt.hash(password, 10);
    await patient.save();

    console.log(
      `Password reset successful for ${patient.patientId} (${patient.username}).`
    );
  } catch (error) {
    console.error("Password reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  }
}

main();
