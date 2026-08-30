import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;

  role:
    | "customer"
    | "professional"
    | "company"
    | "admin";

  profileImage?: string;

  profileImageData?: Buffer;
  profileImageContentType?: string;

  location?: string;

  // ==========================================
  // EMAIL VERIFICATION
  // ==========================================

  isEmailVerified: boolean;

  emailVerificationCode?: string | null;

  emailVerificationExpires?: Date | null;

  // ==========================================
  // ADMIN VERIFICATION
  // ==========================================

  isAdminVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "customer",
        "professional",
        "company",
        "admin",
      ],
      default: "customer",
    },

    profileImage: {
      type: String,
      default: "",
    },

    profileImageData: {
      type: Buffer,
      default: undefined,
    },

    profileImageContentType: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // USER EMAIL VERIFICATION
    // ==========================================

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationCode: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    // ==========================================
    // ADMIN VERIFICATION
    // ==========================================

    isAdminVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>(
  "User",
  userSchema
);

export default User;