import { Request, Response, NextFunction } from "express";

/**
 * Custom Operational Application Error Class.
 */
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 400, code: string = "BAD_REQUEST", details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Centralized Global Error Handling Middleware with normalized error envelope.
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || err.status || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "Une erreur interne du serveur est survenue.";
  const details = err.details || undefined;

  // Log critical 500 errors
  if (statusCode >= 500) {
    console.error(`🚨 [CRITICAL_ERROR] ${req.method} ${req.originalUrl} - ${message}`, err.stack);
  } else {
    console.warn(`⚠️ [CLIENT_ERROR] ${req.method} ${req.originalUrl} - Code: ${code} | Message: ${message}`);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  });
}
