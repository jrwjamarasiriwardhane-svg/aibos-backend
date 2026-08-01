import { Router } from "express";
import {
  applyForJob,
  getApplicationsByJob,
  updateApplicationStatus,
} from "../controllers/applicationController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

console.log("✅ Application Routes Loaded");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Application Route Working",
  });
});

// Professional Apply Job
router.post(
  "/apply",
  protect,
  authorize("professional"),
  applyForJob
);

// Company View Applicants
router.get(
  "/job/:jobId",
  protect,
  authorize("company"),
  getApplicationsByJob
);

// Company Accept / Reject Application
router.put(
  "/:applicationId/status",
  protect,
  authorize("company"),
  updateApplicationStatus
);
router.get(
  "/job/:jobId",
  protect,
  authorize("company"),
  getApplicationsByJob
);

export default router;