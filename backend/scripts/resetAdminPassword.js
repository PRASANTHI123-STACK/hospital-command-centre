
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

    const admin = await User.findOne({
      username: "admin",
      role: "admin",
    }).select("+password");

    if (!admin) {
      throw new Error(
        'Admin account not found. Check the "users" collection and database.'
      );
    }

    const password = await ask(
      "Enter a new Admin password (minimum 12 characters): "
    );

    if (password.length < 12) {
      throw new Error("Password must contain at least 12 characters.");
    }

    const confirmation = await ask("Confirm new password: ");

    if (password !== confirmation) {
      throw new Error("Passwords do not match.");
    }

    admin.password = await bcrypt.hash(password, 12);
    await admin.save();

    console.log("\nAdmin password reset successfully.");
    console.log("Username: admin");
    console.log("Log in using the new password.");
  } finally {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  }
}

main().catch((error) => {
  console.error("Password reset failed:", error.message);
  process.exitCode = 1;
});
