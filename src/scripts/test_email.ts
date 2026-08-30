import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

console.log("Testing EMAIL_USER:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("VERIFY ERROR:", error);
  } else {
    console.log("SUCCESS: Server is ready to send emails!");
  }
  process.exit(0);
});
