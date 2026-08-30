import { Response } from "express";

import User from "../models/User";

import { AuthRequest } from "../middleware/authMiddleware";

// =====================================================
// UPLOAD PROFILE IMAGE
// =====================================================

export const uploadProfileImage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Check authentication
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Check uploaded file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a profile image",
      });
    }

    // Find logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Save image directly into MongoDB
    user.profileImageData = req.file.buffer;

    user.profileImageContentType =
      req.file.mimetype;

    // We are using MongoDB for now
    user.profileImage = "";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,

        profileImage:
          `/api/users/profile-image/${user._id}`,
      },
    });
  } catch (error) {
    console.error(
      "UPLOAD PROFILE IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
    });
  }
};

// =====================================================
// GET PROFILE IMAGE
// =====================================================

export const getProfileImage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findById(id).select(
      "profileImageData profileImageContentType"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check image exists
    if (
      !user.profileImageData ||
      !user.profileImageContentType
    ) {
      return res.status(404).json({
        success: false,
        message: "Profile image not found",
      });
    }

    // Tell browser what type of image this is
    res.set(
      "Content-Type",
      user.profileImageContentType
    );

    res.set(
      "Cache-Control",
      "public, max-age=3600"
    );

    // Send image
    return res.send(user.profileImageData);
  } catch (error) {
    console.error(
      "GET PROFILE IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load profile image",
    });
  }
};