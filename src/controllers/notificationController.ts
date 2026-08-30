import { Response } from "express";
import Notification from "../models/Notification";
import { AuthRequest } from "../middleware/authMiddleware";

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

export const getMyNotifications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user!.id,
    })
      .populate(
        "relatedRequest",
        "category description location status"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// GET UNREAD COUNT
// ==========================================

export const getUnreadNotificationCount = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user!.id,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(
      "GET UNREAD COUNT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: id,
          recipient: req.user!.id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "MARK NOTIFICATION READ ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

export const markAllNotificationsAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user!.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "MARK ALL NOTIFICATIONS READ ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};