import { Router } from "express";

import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

// ==========================================
// GET MY NOTIFICATIONS
// ALL AUTHENTICATED USERS
// ==========================================

router.get(
  "/",
  protect,
  getMyNotifications
);

// ==========================================
// GET UNREAD COUNT
// ==========================================

router.get(
  "/unread-count",
  protect,
  getUnreadNotificationCount
);

// ==========================================
// MARK ALL AS READ
// ==========================================

router.put(
  "/read-all",
  protect,
  markAllNotificationsAsRead
);

// ==========================================
// MARK ONE AS READ
// ==========================================

router.put(
  "/:id/read",
  protect,
  markNotificationAsRead
);

export default router;