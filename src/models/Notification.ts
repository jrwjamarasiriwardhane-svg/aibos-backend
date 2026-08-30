import mongoose, { Document, Schema } from "mongoose";

export type NotificationRole =
  | "customer"
  | "professional"
  | "company"
  | "admin";

export type NotificationType =
  | "NEW_SERVICE_REQUEST"
  | "REQUEST_ACCEPTED"
  | "REQUEST_REJECTED"
  | "REQUEST_CANCELLED"
  | "SERVICE_STARTED"
  | "SERVICE_COMPLETED"
  | "GENERAL";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  recipientRole: NotificationRole;

  type: NotificationType;

  title: string;
  message: string;

  relatedRequest?: mongoose.Types.ObjectId | null;

  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    // User who receives the notification
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Role of recipient
    recipientRole: {
      type: String,
      enum: [
        "customer",
        "professional",
        "company",
        "admin",
      ],
      required: true,
    },

    // Notification type
    type: {
      type: String,
      enum: [
        "NEW_SERVICE_REQUEST",
        "REQUEST_ACCEPTED",
        "REQUEST_REJECTED",
        "REQUEST_CANCELLED",
        "SERVICE_STARTED",
        "SERVICE_COMPLETED",
        "GENERAL",
      ],
      required: true,
    },

    // Notification title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional service request reference
    relatedRequest: {
      type: Schema.Types.ObjectId,
      ref: "ServiceRequest",
      default: null,
    },

    // Read / unread
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Faster notification queries
notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;