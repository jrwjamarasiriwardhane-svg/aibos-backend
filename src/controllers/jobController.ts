import { Request, Response } from "express";
import Job from "../models/Job";
import { AuthRequest } from "../middleware/authMiddleware";

// ==============================
// Create Job
// ==============================
export const createJob = async (
  req: AuthRequest,
  res: Response
) => {
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
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Get All Jobs
// ==============================
export const getAllJobs = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      search,
      category,
      location,
      page = "1",
      limit = "10",
    } = req.query;

    const query: any = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = location;
    }

    const currentPage = Number(page);
    const pageSize = Number(limit);

    const jobs = await Job.find(query)
      .populate("company", "fullName email")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    const totalJobs = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      totalJobs,
      currentPage,
      totalPages: Math.ceil(totalJobs / pageSize),
      jobs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Get Job By ID
// ==============================
export const getJobById = async (
  req: Request,
  res: Response
) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "company",
      "fullName email"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Update Job
// ==============================
export const updateJob = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Delete Job
// ==============================
export const deleteJob = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// Get My Jobs
export const getMyJobs = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const jobs = await Job.find({
      company: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });

  } catch (error) {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Server Error",
  });
}
}