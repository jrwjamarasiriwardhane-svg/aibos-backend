import { Response } from "express";
import ProfessionalProfile from "../models/ProfessionalProfile";
import { AuthRequest } from "../middleware/authMiddleware";
import CompanyProfile from "../models/CompanyProfile";
// ==============================
// Create Professional Profile
// ==============================
export const createProfessionalProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const existing = await ProfessionalProfile.findOne({
      user: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const profile = await ProfessionalProfile.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Get My Profile
// ==============================
export const getProfessionalProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const profile = await ProfessionalProfile.findOne({
      user: req.user.id,
    }).populate(
      "user",
      "fullName email phone profileImage"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Update Profile
// ==============================
export const updateProfessionalProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const profile = await ProfessionalProfile.findOneAndUpdate(
      {
        user: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
