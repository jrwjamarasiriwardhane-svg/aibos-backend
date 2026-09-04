import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./User";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing from .env");
  }

  await mongoose.connect(MONGO_URI);

  const email = "aibosadmin@gmail.com";
  const password = "AibosAdmin@2026";

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    console.log("User already exists");
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    fullName: "AIBOS Admin",
    email: email,
    phone: "0712345678",
    password: hashedPassword,
    role: "admin",
    isEmailVerified: true,
    isAdminVerified: true,
  });

  console.log("================================");
  console.log("ADMIN CREATED SUCCESSFULLY");
  console.log("Email:", admin.email);
  console.log("Password:", password);
  console.log("Role:", admin.role);
  console.log("================================");

  await mongoose.disconnect();
}

createAdmin().catch((error) => {
  console.error("ERROR:", error);
  process.exit(1);
});