import { Router } from "express";

import {
  getMyProfessionalProfile,
  updateProfessionalProfile,
} from "../controllers/professionalProfileController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

// Test
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Professional Profile Route Working",
  });
});

// Get my professional profile
router.get(
  "/me",
  protect,
  authorize("professional"),
  getMyProfessionalProfile
);

// Update my professional profile
router.put(
  "/me",
  protect,
  authorize("professional"),
  updateProfessionalProfile
);

export default router;