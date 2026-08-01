import { Response } from "express";
import Application from "../models/Application";
import Job from "../models/Job";
import { AuthRequest } from "../middleware/authMiddleware";

// Apply for a Job
export const applyForJob = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      professional: req.user.id,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await Application.create({
      professional: req.user.id,
      job: jobId,
      coverLetter,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
  
};
// Update Application Status
export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Only accepted or rejected
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application = await Application.findById(applicationId).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const job: any = application.job;

    // Owner check
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      application,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// Get Applications for a Job
export const getApplicationsByJob = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { jobId } = req.params;

    // Find Job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check Job Owner
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    // Get Applications
    const applications = await Application.find({
      job: jobId,
    }).populate(
      "professional",
      "fullName email phone"
    );

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};