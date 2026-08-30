import { Response } from "express";

import ProfessionalProfile from "../models/ProfessionalProfile";
import { AuthRequest } from "../middleware/authMiddleware";

// ======================================================
// GET MY PROFESSIONAL PROFILE
// ======================================================

export const getMyProfessionalProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    let profile = await ProfessionalProfile.findOne({
      user: req.user!.id,
    }).populate(
      "user",
      "fullName email phone profileImage"
    );

    // Create profile automatically if it doesn't exist
    if (!profile) {
      profile = await ProfessionalProfile.create({
        user: req.user!.id,
      });

      profile = await ProfessionalProfile.findById(
        profile._id
      ).populate(
        "user",
        "fullName email phone profileImage"
      );
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error(
      "GET PROFESSIONAL PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// CREATE / UPDATE PROFILE
// ======================================================

export const updateProfessionalProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      bio,
      skills,
      experienceYears,
      location,
      hourlyRate,
      isAvailable,
    } = req.body;

    const profile =
      await ProfessionalProfile.findOneAndUpdate(
        {
          user: req.user!.id,
        },
        {
          bio,
          skills,
          experienceYears,
          location,
          hourlyRate,
          isAvailable,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      ).populate(
        "user",
        "fullName email phone profileImage"
      );

    return res.status(200).json({
      success: true,
      message: "Professional profile updated",
      profile,
    });
  } catch (error) {
    console.error(
      "UPDATE PROFESSIONAL PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};