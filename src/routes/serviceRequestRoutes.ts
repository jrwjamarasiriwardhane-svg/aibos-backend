import { Router } from "express";

import {
  createServiceRequest,
  getMyServiceRequests,
  getServiceRequestById,
  getAvailableServiceRequests,
  acceptServiceRequest,
  rejectServiceRequest,
} from "../controllers/serviceRequestController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

// ======================================================
// CUSTOMER
// ======================================================

// Create service request
router.post(
  "/",
  protect,
  authorize("customer"),
  createServiceRequest
);

// Get my service requests
router.get(
  "/my",
  protect,
  authorize("customer"),
  getMyServiceRequests
);

// ======================================================
// PROFESSIONAL
// IMPORTANT:
// These routes MUST come BEFORE "/:id"
// ======================================================

// Get available service requests
router.get(
  "/available",
  protect,
  authorize("professional"),
  getAvailableServiceRequests
);

// Accept service request
router.put(
  "/:id/accept",
  protect,
  authorize("professional"),
  acceptServiceRequest
);

// Reject service request
router.put(
  "/:id/reject",
  protect,
  authorize("professional"),
  rejectServiceRequest
);

// ======================================================
// CUSTOMER - SINGLE REQUEST
// This MUST be AFTER /available
// ======================================================

router.get(
  "/:id",
  protect,
  authorize("customer"),
  getServiceRequestById
);

export default router;