import mongoose, { Schema, Document } from "mongoose";

export interface IServiceRequest extends Document {
  customer: mongoose.Types.ObjectId;

  category: string;

  company?: mongoose.Types.ObjectId;

  description: string;

  location: string;

  preferredDate?: Date;

  preferredTime?: string;

  budget?: number;

  status:
    | "pending"
    | "matched"
    | "accepted"
    | "in_progress"
    | "completed"
    | "cancelled";

  assignedProfessional?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const serviceRequestSchema =
  new Schema<IServiceRequest>(
    {
      // Customer who created the request
      customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      // Service category
      category: {
        type: String,
        required: true,
        trim: true,
      },

      // Optional company selected by customer
      company: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      // What the customer needs
      description: {
        type: String,
        required: true,
        trim: true,
      },

      // Customer service location
      location: {
        type: String,
        required: true,
        trim: true,
      },

      // Preferred service date
      preferredDate: {
        type: Date,
      },

      // Preferred time
      preferredTime: {
        type: String,
        default: "",
      },

      // Customer budget
      budget: {
        type: Number,
        min: 0,
      },

      // Request status
      status: {
        type: String,
        enum: [
          "pending",
          "matched",
          "accepted",
          "in_progress",
          "completed",
          "cancelled",
        ],
        default: "pending",
      },

      // Professional assigned later
      assignedProfessional: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

const ServiceRequest =
  mongoose.model<IServiceRequest>(
    "ServiceRequest",
    serviceRequestSchema
  );

export default ServiceRequest;