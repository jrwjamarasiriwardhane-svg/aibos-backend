import { Router } from "express";
import { register, login } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Any logged-in user
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Profile Access Granted",
  });
});

// Admin only
router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

// Company only
router.get(
  "/company",
  protect,
  authorize("company"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Company",
    });
  }
);

// Professional only
router.get(
  "/professional",
  protect,
  authorize("professional"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Professional",
    });
  }
);

// Customer only
router.get(
  "/customer",
  protect,
  authorize("customer"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Customer",
    });
  }
);

export default router;