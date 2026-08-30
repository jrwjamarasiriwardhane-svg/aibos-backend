import { Response } from "express";
import mongoose from "mongoose";
import ProfessionalProfile from "../models/ProfessionalProfile";
import { AuthRequest } from "../middleware/authMiddleware";

// ======================================================
// GET VERIFIED PROFESSIONALS
// Customer can search verified + available professionals
// ======================================================
export const getProfessionals = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { category, location, search, page = 1, limit = 10 } = req.query;

    // Base filter: Only verified & available professionals are public
    const filter: any = {
      verificationStatus: "verified",
      isAvailable: true,
    };

    if (category) {
      filter.skills = {
        $regex: category as string,
        $options: "i",
      };
    }

    if (location) {
      filter.location = {
        $regex: location as string,
        $options: "i",
      };
    }

    if (search) {
      filter.$or = [
        { bio: { $regex: search as string, $options: "i" } },
        { location: { $regex: search as string, $options: "i" } },
        { skills: { $regex: search as string, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await ProfessionalProfile.countDocuments(filter);
    const professionals = await ProfessionalProfile.find(filter)
      .populate("user", "fullName email phone profileImage location")
      .sort({
        rating: -1,
        completedJobs: -1,
        experienceYears: -1,
      })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: professionals.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      professionals,
    });
  } catch (error) {
    console.error("GET PROFESSIONALS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// GET SINGLE PROFESSIONAL BY ID
// Customer can view a single verified professional profile
// ======================================================
export const getProfessionalById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid professional profile ID",
      });
    }

    const professional = await ProfessionalProfile.findOne({
      _id: id,
      verificationStatus: "verified",
    }).populate("user", "fullName email phone profileImage location");

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional profile not found or not verified",
      });
    }

    return res.status(200).json({
      success: true,
      professional,
    });
  } catch (error) {
    console.error("GET PROFESSIONAL BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};