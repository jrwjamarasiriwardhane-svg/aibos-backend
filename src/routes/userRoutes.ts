import { Router } from "express";

import {
  uploadProfileImage,
  getProfileImage,
} from "../controllers/userController";

import { protect } from "../middleware/authMiddleware";

import upload from "../middleware/uploadMiddleware";

const router = Router();

// =====================================================
// UPLOAD PROFILE IMAGE
// =====================================================

router.post(
  "/profile-image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

// =====================================================
// GET PROFILE IMAGE
// =====================================================

router.get(
  "/profile-image/:id",
  getProfileImage
);

export default router;