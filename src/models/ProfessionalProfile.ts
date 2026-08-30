import mongoose, { Schema, Document } from "mongoose";

export interface IProfessionalProfile extends Document {
  user: mongoose.Types.ObjectId;

  bio?: string;
  skills: string[];
  experienceYears: number;
  location?: string;
  hourlyRate?: number;

  isAvailable: boolean;

  verificationStatus:
    | "pending"
    | "under_review"
    | "verified"
    | "rejected"
    | "suspended";

  identityVerified: boolean;
  skillsVerified: boolean;

  rating: number;
  totalJobs: number;
  completedJobs: number;

  rejectionReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const professionalProfileSchema =
  new Schema<IProfessionalProfile>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      bio: {
        type: String,
        default: "",
        trim: true,
      },

      skills: {
        type: [String],
        default: [],
      },

      experienceYears: {
        type: Number,
        default: 0,
        min: 0,
      },

      location: {
        type: String,
        default: "",
        trim: true,
      },

      hourlyRate: {
        type: Number,
        default: 0,
        min: 0,
      },

      isAvailable: {
        type: Boolean,
        default: true,
      },

      verificationStatus: {
        type: String,
        enum: [
          "pending",
          "under_review",
          "verified",
          "rejected",
          "suspended",
        ],
        default: "pending",
      },

      identityVerified: {
        type: Boolean,
        default: false,
      },

      skillsVerified: {
        type: Boolean,
        default: false,
      },

      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      totalJobs: {
        type: Number,
        default: 0,
      },

      completedJobs: {
        type: Number,
        default: 0,
      },

      rejectionReason: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

const ProfessionalProfile =
  mongoose.model<IProfessionalProfile>(
    "ProfessionalProfile",
    professionalProfileSchema
  );

export default ProfessionalProfile;