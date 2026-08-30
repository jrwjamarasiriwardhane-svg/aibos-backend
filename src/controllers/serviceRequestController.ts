import { Response } from "express";
import ServiceRequest from "../models/ServiceRequest";
import { AuthRequest } from "../middleware/authMiddleware";
import { createNotification } from "../services/notificationService";

// ==========================================
// CREATE SERVICE REQUEST - CUSTOMER
// ==========================================

export const createServiceRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      category,
      company,
      description,
      location,
      preferredDate,
      preferredTime,
      budget,
    } = req.body;

    if (!category || !description || !location) {
      return res.status(400).json({
        success: false,
        message:
          "Category, description and location are required",
      });
    }

    const newServiceRequest = await ServiceRequest.create({
      customer: req.user!.id,
      category,
      company: company || null,
      description,
      location,
      preferredDate: preferredDate || null,
      preferredTime: preferredTime || "",
      budget: budget || 0,
      status: "pending",
      assignedProfessional: null,
    });

    // Populate customer details before returning the response
    const serviceRequest = await ServiceRequest.findById(newServiceRequest._id)
      .populate("customer", "fullName email phone profileImage")
      .populate("company", "fullName email phone profileImage");

    return res.status(201).json({
      success: true,
      message: "Service request created successfully",
      request: serviceRequest,
    });
  } catch (error) {
    console.error(
      "CREATE SERVICE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// GET MY SERVICE REQUESTS - CUSTOMER
// ==========================================

export const getMyServiceRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const requests = await ServiceRequest.find({
      customer: req.user!.id,
    })
      .populate(
        "customer",
        "fullName email phone profileImage"
      )
      .populate(
        "company",
        "fullName email phone profileImage"
      )
      .populate(
        "assignedProfessional",
        "fullName email phone profileImage"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "GET MY SERVICE REQUESTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// GET SINGLE SERVICE REQUEST - CUSTOMER
// ==========================================

export const getServiceRequestById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const request = await ServiceRequest.findOne({
      _id: req.params.id,
      customer: req.user!.id,
    })
      .populate(
        "customer",
        "fullName email phone profileImage"
      )
      .populate(
        "company",
        "fullName email phone profileImage"
      )
      .populate(
        "assignedProfessional",
        "fullName email phone profileImage"
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error(
      "GET SERVICE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// GET AVAILABLE SERVICE REQUESTS - PROFESSIONAL
// ==========================================

export const getAvailableServiceRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const requests = await ServiceRequest.find({
      status: "pending",
      assignedProfessional: null,
    })
      .populate(
        "customer",
        "fullName email phone profileImage"
      )
      .populate(
        "company",
        "fullName email phone profileImage"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "GET AVAILABLE SERVICE REQUESTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// ACCEPT SERVICE REQUEST - PROFESSIONAL
// ==========================================

export const acceptServiceRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const request = await ServiceRequest.findOneAndUpdate(
      {
        _id: id,
        status: "pending",
        assignedProfessional: null,
      },
      {
        assignedProfessional: req.user!.id,
        status: "accepted",
      },
      {
        new: true,
      }
    )
      .populate(
        "customer",
        "fullName email phone profileImage"
      )
      .populate(
        "assignedProfessional",
        "fullName email phone profileImage"
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Service request is no longer available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service request accepted",
      request,
    });
  } catch (error) {
    console.error(
      "ACCEPT SERVICE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// REJECT SERVICE REQUEST - PROFESSIONAL
// ==========================================

export const rejectServiceRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const request = await ServiceRequest.findOne({
      _id: id,
      status: "pending",
      assignedProfessional: null,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Service request is no longer available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service request rejected",
    });
  } catch (error) {
    console.error(
      "REJECT SERVICE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};