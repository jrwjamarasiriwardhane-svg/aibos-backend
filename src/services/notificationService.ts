import mongoose from "mongoose";
import Notification, {
  NotificationRole,
  NotificationType,
} from "../models/Notification";

interface CreateNotificationData {
  recipient: mongoose.Types.ObjectId | string;

  recipientRole: NotificationRole;

  type: NotificationType;

  title: string;

  message: string;

  relatedRequest?: mongoose.Types.ObjectId | string | null;
}

export const createNotification = async ({
  recipient,
  recipientRole,
  type,
  title,
  message,
  relatedRequest = null,
}: CreateNotificationData) => {
  try {
    const notification = await Notification.create({
      recipient,
      recipientRole,
      type,
      title,
      message,
      relatedRequest,
      isRead: false,
    });

    return notification;
  } catch (error) {
    console.error(
      "CREATE NOTIFICATION ERROR:",
      error
    );

    // Notification failure should not break
    // the main business operation.
    return null;
  }
};