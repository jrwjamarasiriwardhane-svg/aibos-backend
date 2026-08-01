import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
} from "../controllers/jobController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

// Public Routes
router.get("/", getAllJobs);

// Company Routes
router.get(
  "/my-jobs",
  protect,
  authorize("company"),
  getMyJobs
);

router.post(
  "/create",
  protect,
  authorize("company"),
  createJob
);

// Public Route
router.get("/:id", getJobById);

// Company Routes
router.put(
  "/:id",
  protect,
  authorize("company"),
  updateJob
);

router.delete(
  "/:id",
  protect,
  authorize("company"),
  deleteJob
);

export default router;