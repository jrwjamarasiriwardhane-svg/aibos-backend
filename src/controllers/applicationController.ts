import { Response } from "express";
import Application from "../models/Application";
import Job from "../models/Job";
import { AuthRequest } from "../middleware/authMiddleware";

// ==============================
// Apply for Job
// ==============================
export const applyForJob = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

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

// ==============================
// Company - View Applicants
// ==============================
export const getApplicationsByJob = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

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

// ==============================
// Company - Accept / Reject
// ==============================
export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application: any = await Application.findById(applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.job.company.toString() !== req.user.id) {
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

// ==============================
// Professional - My Applications
// ==============================
export const getMyApplications = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const applications = await Application.find({
      professional: req.user.id,
    })
      .populate({
        path: "job",
        select: "title description category location salary status",
        populate: {
          path: "company",
          select: "fullName email phone",
        },
      })
      .sort({ createdAt: -1 });

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