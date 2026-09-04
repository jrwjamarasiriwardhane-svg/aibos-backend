import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../models/User";

dotenv.config();

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI is not defined in .env file"
      );
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected");

    const email = "admin@aibos.com";
    const password = "Admin@12345";

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      console.log("Email:", existingAdmin.email);

      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create admin
    const admin = await User.create({
      fullName: "AIBOS Admin",
      email,
      phone: "0000000000",
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
      isAdminVerified: true,
    });

    console.log("");
    console.log("================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("================================");
    console.log("Email:", admin.email);
    console.log("Password:", password);
    console.log("Role:", admin.role);
    console.log("================================");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("CREATE ADMIN ERROR:");
    console.error(error);

    process.exit(1);
  }
};

createAdmin();