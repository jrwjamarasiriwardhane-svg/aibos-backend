import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  professional: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  coverLetter: string;
  status: "pending" | "accepted" | "rejected";
}

const applicationSchema = new Schema(
  {
    professional: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    coverLetter: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IApplication>(
  "Application",
  applicationSchema
);