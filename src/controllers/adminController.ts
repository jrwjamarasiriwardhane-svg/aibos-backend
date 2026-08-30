import { Request, Response } from "express";
import ProfessionalProfile from "../models/ProfessionalProfile";
import { AuthRequest } from "../middleware/authMiddleware";

export const getPendingProfessionals = async (
  req: Request,
  res: Response
) => {
  try {
    const professionals =
      await ProfessionalProfile.find({
        verificationStatus: "pending",
      })
        .populate(
          "user",
          "fullName email phone profileImage"
        )
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      professionals,
    });
  } catch (error) {
    console.error(
      "GET PENDING PROFESSIONALS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ======================================================
// VERIFY PROFESSIONAL
// ======================================================

export const verifyProfessional = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const profile =
      await ProfessionalProfile.findByIdAndUpdate(
        id,
        {
          verificationStatus: "verified",
          identityVerified: true,
          skillsVerified: true,
          rejectionReason: "",
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "user",
        "fullName email phone profileImage"
      );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Professional profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Professional verified successfully",
      profile,
    });
  } catch (error) {
    console.error(
      "VERIFY PROFESSIONAL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// REJECT PROFESSIONAL
// ======================================================

export const rejectProfessional = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { rejectionReason } = req.body;

    const profile =
      await ProfessionalProfile.findByIdAndUpdate(
        id,
        {
          verificationStatus: "rejected",
          rejectionReason:
            rejectionReason ||
            "Verification rejected by admin",
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "user",
        "fullName email phone profileImage"
      );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Professional profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Professional rejected successfully",
      profile,
    });
  } catch (error) {
    console.error(
      "REJECT PROFESSIONAL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};