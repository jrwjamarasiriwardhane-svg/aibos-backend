import mongoose, { Schema, Document } from "mongoose";

export interface IVerificationDocument extends Document {
  professional: mongoose.Types.ObjectId;

  documentType:
    | "government_id"
    | "certificate"
    | "license"
    | "experience_proof";

  documentUrl: string;

  status:
    | "pending"
    | "approved"
    | "rejected";

  rejectionReason?: string;

  reviewedBy?: mongoose.Types.ObjectId;

  reviewedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const verificationDocumentSchema =
  new Schema<IVerificationDocument>(
    {
      professional: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      documentType: {
        type: String,
        enum: [
          "government_id",
          "certificate",
          "license",
          "experience_proof",
        ],
        required: true,
      },

      documentUrl: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "rejected",
        ],
        default: "pending",
      },

      rejectionReason: {
        type: String,
        default: "",
      },

      reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      reviewedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

const VerificationDocument =
  mongoose.model<IVerificationDocument>(
    "VerificationDocument",
    verificationDocumentSchema
  );

export default VerificationDocument;