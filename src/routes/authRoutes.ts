import { Router } from "express";

import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
} from "../controllers/authController";

const router = Router();

// ==========================================
// REGISTER
// ==========================================

router.post(
  "/register",
  register
);

// ==========================================
// LOGIN
// ==========================================

router.post(
  "/login",
  login
);

// ==========================================
// VERIFY EMAIL
// ==========================================

router.post(
  "/verify-email",
  verifyEmail
);

// ==========================================
// RESEND VERIFICATION CODE
// ==========================================

router.post(
  "/resend-verification",
  resendVerificationCode
);

export default router;