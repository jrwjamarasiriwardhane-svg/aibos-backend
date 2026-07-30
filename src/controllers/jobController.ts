import { Request, Response } from "express";
import Job from "../models/Job";
import { AuthRequest } from "../middleware/authMiddleware";

// Create Job
export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, location, salary } = req.body;

    const job = await Job.create({
      title,
      description,
      category,
      location,
      salary,
      company: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};