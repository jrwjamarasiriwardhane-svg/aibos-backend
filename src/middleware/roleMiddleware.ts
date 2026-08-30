import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const authorize = (...allowedRoles: string[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const userRole = String(
      req.user.role || ""
    )
      .trim()
      .toLowerCase();

    const roles = allowedRoles.map((role) =>
      String(role).trim().toLowerCase()
    );

    console.log("========== ROLE DEBUG ==========");
    console.log("USER:", req.user);
    console.log("USER ROLE:", userRole);
    console.log("ALLOWED ROLES:", roles);
    console.log("================================");

    if (!roles.includes(userRole)) {
      console.log(
        `ACCESS DENIED: ${userRole} is not allowed`
      );

      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    next();
  };
};