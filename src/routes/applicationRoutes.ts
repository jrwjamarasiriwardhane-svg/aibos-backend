import { Router } from "express";
import {
  applyForJob,
  getApplicationsByJob,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

// ==============================
// Test Route
// ==============================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Application Route Working",
  });
});

// ==============================
// Professional Routes
// ==============================

// Apply for Job
router.post(
  "/apply",
  protect,
  authorize("professional"),
  applyForJob
);

// My Applications
router.get(
  "/my-applications",
  protect,
  authorize("professional"),
  getMyApplications
);

// ==============================
// Company Routes
// ==============================

// View Applicants for a Job
router.get(
  "/job/:jobId",
  protect,
  authorize("company"),
  getApplicationsByJob
);

// Accept / Reject Application
router.put(
  "/:applicationId/status",
  protect,
  authorize("company"),
  updateApplicationStatus

);

export default router;