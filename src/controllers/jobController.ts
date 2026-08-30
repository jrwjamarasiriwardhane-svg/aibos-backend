import { Response } from "express";
import mongoose from "mongoose";
import Job from "../models/Job";
import Application from "../models/Application";
import { AuthRequest } from "../middleware/authMiddleware";

// ==========================================
// CREATE JOB - COMPANY
// ==========================================
export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, location, salary, status } = req.body;

    if (!title || !description || !category || !location || salary === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category, location, and salary are required",
      });
    }

    const userId = req.user?.id || req.user?._id;

    const job = await Job.create({
      title,
      description,
      category,
      location,
      salary,
      company: userId,
      status: status || "open",
    });

    const populatedJob = await Job.findById(job._id).populate(
      "company",
      "fullName email phone profileImage"
    );

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: populatedJob,
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// GET ALL JOBS - PUBLIC (With Filter, Search & Pagination)
// ==========================================
export const getAllJobs = async (req: AuthRequest, res: Response) => {
  try {
    const { search, category, location, status, page = 1, limit = 10 } = req.query;

    const query: any = {};

    // By default, show open jobs unless status query filter is specified
    if (status) {
      if (status !== "all") {
        query.status = status;
      }
    } else {
      query.status = "open";
    }

    if (category) {
      query.category = { $regex: category as string, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location as string, $options: "i" };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: "i" } },
        { description: { $regex: search as string, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate("company", "fullName email phone profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      jobs,
    });
  } catch (error) {
    console.error("GET ALL JOBS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// GET SINGLE JOB - PUBLIC
// ==========================================
export const getJobById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id).populate(
      "company",
      "fullName email phone profileImage location"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("GET JOB BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// GET MY JOBS - COMPANY
// ==========================================
export const getMyJobs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { status } = req.query;

    const query: any = { company: userId };

    if (status && status !== "all") {
      query.status = status;
    }

    const jobs = await Job.find(query)
      .populate("company", "fullName email phone profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("GET MY JOBS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// UPDATE JOB - COMPANY
// ==========================================
export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const userId = req.user?.id || req.user?._id;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.company.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: You are not authorized to update this job",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("company", "fullName email phone profileImage");

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// DELETE JOB - COMPANY
// ==========================================
export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const userId = req.user?.id || req.user?._id;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.company.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: You are not authorized to delete this job",
      });
    }

    await job.deleteOne();

    // Clean up applications for this job
    await Application.deleteMany({ job: id });

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};