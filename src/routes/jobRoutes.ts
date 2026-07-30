import { Router } from "express";
import { createJob } from "../controllers/jobController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

// Company only
router.post(
  "/create",
  protect,
  authorize("company"),
  createJob
);

export default router;