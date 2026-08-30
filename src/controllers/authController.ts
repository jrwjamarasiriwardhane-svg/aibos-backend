import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../services/emailService";

// =====================================================
// REGISTER
// =====================================================

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
      location,
    } = req.body;

    // ================================================
    // REQUIRED FIELDS
    // ================================================

    if (
      !fullName ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // ================================================
    // CHECK EXISTING USER
    // ================================================

    const existingUser = await User.findOne({
      $or: [
        {
          email: normalizedEmail,
        },
        {
          phone: phone.trim(),
        },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ================================================
    // HASH PASSWORD
    // ================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ================================================
    // GENERATE 6 DIGIT CODE
    // ================================================

    const verificationCode =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();

    // ================================================
    // CODE EXPIRES AFTER 10 MINUTES
    // ================================================

    const verificationExpires =
      new Date(
        Date.now() + 10 * 60 * 1000
      );

    // ================================================
    // CREATE USER
    // ================================================

    const user = new User({
      fullName: fullName.trim(),

      email: normalizedEmail,

      phone: phone.trim(),

      password: hashedPassword,

      role: role || "customer",

      location: location || "",

      // USER EMAIL VERIFICATION
      isEmailVerified: false,

      emailVerificationCode:
        verificationCode,

      emailVerificationExpires:
        verificationExpires,

      // ADMIN VERIFICATION
      isAdminVerified: false,
    });

    // ================================================
    // SAVE USER
    // ================================================

    await user.save();

    // ================================================
    // SEND VERIFICATION EMAIL
    // ================================================

    try {
      await sendVerificationEmail(
        user.email,
        user.fullName,
        verificationCode
      );
    } catch (emailError) {
      console.error(
        "EMAIL SEND ERROR (Proceeding with console verification code for dev):",
        emailError
      );
      console.log(
        `\n==================================================\n🔑 VERIFICATION CODE for ${user.email}: ${verificationCode}\n==================================================\n`
      );
    }

    // ================================================
    // RESPONSE
    // ================================================

    return res.status(201).json({
      success: true,

      message:
        "Account created successfully. Verification code sent to your email.",

      requiresEmailVerification: true,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,

        isEmailVerified:
          user.isEmailVerified,

        isAdminVerified:
          user.isAdminVerified,
      },
    });

  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// VERIFY EMAIL
// =====================================================

export const verifyEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      code,
    } = req.body;

    // ================================================
    // VALIDATION
    // ================================================

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message:
          "Email and verification code are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const normalizedCode =
      code.toString().trim();

    // ================================================
    // FIND USER
    // ================================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ================================================
    // CHECK ALREADY VERIFIED
    // ================================================

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Email is already verified",
      });
    }

    // ================================================
    // CHECK CODE
    // ================================================

    if (
      user.emailVerificationCode !==
      normalizedCode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid verification code",
      });
    }

    // ================================================
    // CHECK EXPIRY
    // ================================================

    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires.getTime() <
        Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Verification code has expired",
      });
    }

    // ================================================
    // VERIFY EMAIL
    // ================================================

    user.isEmailVerified = true;

    user.emailVerificationCode = null;

    user.emailVerificationExpires = null;

    await user.save();

    // ================================================
    // RESPONSE
    // ================================================

    return res.status(200).json({
      success: true,

      message:
        "Email verified successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,

        isEmailVerified:
          user.isEmailVerified,

        isAdminVerified:
          user.isAdminVerified,
      },
    });

  } catch (error) {
    console.error(
      "VERIFY EMAIL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ================================================
    // VALIDATION
    // ================================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // ================================================
    // FIND USER
    // ================================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ================================================
    // CHECK PASSWORD
    // ================================================

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ================================================
    // CHECK EMAIL VERIFICATION
    // ================================================

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,

        message:
          "Please verify your email before logging in",

        requiresEmailVerification:
          true,

        email: user.email,
      });
    }

    // ================================================
    // CREATE JWT
    // ================================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET as string,

      {
        expiresIn: "7d",
      }
    );

    // ================================================
    // RESPONSE
    // ================================================

    return res.status(200).json({
      success: true,

      message: "Login successful",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,

        isEmailVerified:
          user.isEmailVerified,

        isAdminVerified:
          user.isAdminVerified,
      },
    });

  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// RESEND VERIFICATION CODE
// =====================================================

export const resendVerificationCode = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verificationExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = verificationExpires;

    await user.save();

    try {
      await sendVerificationEmail(
        user.email,
        user.fullName,
        verificationCode
      );
    } catch (emailErr) {
      console.error("RESEND EMAIL SEND ERROR:", emailErr);
      console.log(
        `\n==================================================\n🔑 RESENT VERIFICATION CODE for ${user.email}: ${verificationCode}\n==================================================\n`
      );
    }

    return res.status(200).json({
      success: true,
      message: "A new verification code has been generated",
    });
  } catch (error) {
    console.error("RESEND VERIFICATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};