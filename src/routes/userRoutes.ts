import { Router } from "express";

import {
  uploadProfileImage,
  getProfileImage,
  deleteProfileImage,
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
// DELETE PROFILE IMAGE
// =====================================================

router.delete(
  "/profile-image",
  protect,
  deleteProfileImage
);

// =====================================================
// GET PROFILE IMAGE
// =====================================================

router.get(
  "/profile-image/:id",
  getProfileImage
);

export default router;