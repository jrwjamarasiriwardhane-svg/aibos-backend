import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyProfile extends Document {
  user: mongoose.Types.ObjectId;
  companyName: string;
  description: string;
  industry: string;
  categories: string[];
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  logo: string;
  establishedYear: number;
  employeeCount: number;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  isVerified: boolean;
  isAvailable: boolean;
}

const companyProfileSchema = new Schema<ICompanyProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    industry: {
      type: String,
      default: "",
      trim: true,
    },

    categories: {
      type: [String],
      default: [],
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    establishedYear: {
      type: Number,
      default: new Date().getFullYear(),
    },

    employeeCount: {
      type: Number,
      default: 1,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    completedJobs: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
       default: true,
    },
    
  },
  {
    timestamps: true,
  }
);

const CompanyProfile = mongoose.model<ICompanyProfile>(
  "CompanyProfile",
  companyProfileSchema
);

export default CompanyProfile;