import { Router } from "express";

import {
  getProfessionals,
  getProfessionalById,
} from "../controllers/professionalController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

// ======================================================
// CUSTOMER - SEARCH VERIFIED PROFESSIONALS
// ======================================================

router.get(
  "/",
  protect,
  authorize("customer"),
  getProfessionals
);

// ======================================================
// CUSTOMER - VIEW SINGLE PROFESSIONAL
// ======================================================

router.get(
  "/:id",
  protect,
  authorize("customer"),
  getProfessionalById
);

export default router;