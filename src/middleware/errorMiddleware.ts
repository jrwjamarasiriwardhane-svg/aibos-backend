import { Request, Response, NextFunction } from "express";

// 404 Handler for Undefined Routes
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    message: `Resource not found - ${req.originalUrl}`,
  });
};

// Central Error Handler Middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("GLOBAL ERROR HANDLER:", err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
