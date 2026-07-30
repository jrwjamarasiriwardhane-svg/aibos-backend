import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Welcome to AIBOS Backend",
  });
});

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

export default app;