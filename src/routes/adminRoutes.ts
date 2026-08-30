import { Router } from "express";

import {
  getPendingProfessionals,
  verifyProfessional,
  rejectProfessional,
} from "../controllers/adminController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

// ======================================================
// GET PENDING PROFESSIONALS
// ======================================================

router.get(
  "/professionals/pending",
  protect,
  authorize("admin"),
  getPendingProfessionals
);

// ======================================================
// VERIFY PROFESSIONAL
// ======================================================

router.put(
  "/professionals/:id/verify",
  protect,
  authorize("admin"),
  verifyProfessional
);

// ======================================================
// REJECT PROFESSIONAL
// ======================================================

router.put(
  "/professionals/:id/reject",
  protect,
  authorize("admin"),
  rejectProfessional
);

export default router;