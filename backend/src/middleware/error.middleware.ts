import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${error.message}`);

  // Handle Validation Errors (Zod)
  if (error instanceof ZodError) {
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // Handle Known Operational Errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
    return;
  }

  // Handle Unexpected Errors
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
