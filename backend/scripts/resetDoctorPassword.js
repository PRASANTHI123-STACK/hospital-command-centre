
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
require("dotenv").config();

const User = require("../models/User");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

async function main() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const user = await User.findOne({
      username: "doc-1010",
      doctorId: "DOC-1010",
      role: "doctor",
    }).select("+password");

    if (!user) {
      throw new Error(
        "Linked DOC-1010 login account was not found."
      );
    }

    const password = await ask(
      "Enter a new temporary password (minimum 12 characters): "
    );

    if (password.length < 12) {
      throw new Error("Password must contain at least 12 characters.");
    }

    const confirmation = await ask("Confirm password: ");

    if (password !== confirmation) {
      throw new Error("Passwords do not match.");
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    console.log("\nDoctor password reset successfully.");
    console.log("Username: doc-1010");
    console.log("Doctor ID: DOC-1010");
    console.log("Use the new password to log in.");
  } finally {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  }
}

main().catch((error) => {
  console.error("Password reset failed:", error.message);
  process.exitCode = 1;
});
