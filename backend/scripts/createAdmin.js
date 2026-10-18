
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
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
      throw new Error(
        "Check that MONGO_URI and JWT_SECRET exist in backend/.env"
      );
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("An Admin account already exists.");
      return;
    }

    const usernameInput = await ask(
      "Admin username (default: admin): "
    );
    const username = (usernameInput.trim() || "admin").toLowerCase();

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      throw new Error(
        "This username already exists. Choose another username."
      );
    }

    const password = await ask(
      "Enter a strong Admin password (minimum 12 characters): "
    );

    if (password.length < 12) {
      throw new Error("Password must contain at least 12 characters.");
    }

    const confirmation = await ask("Confirm password: ");

    if (password !== confirmation) {
      throw new Error("Passwords do not match.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({
      username,
      password: passwordHash,
      role: "admin",
      doctorId: null,
      isActive: true,
    });

    console.log("\nAdmin account created successfully.");
    console.log("Username:", username);
    console.log("Role: admin");
    console.log("Now log in using the username and password you entered.");
  } finally {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  }
}

main().catch((error) => {
  console.error("Failed to create Admin:", error.message);
  process.exitCode = 1;
});
