import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { prisma } from "../config/db";

/**
 * Audit Logging Middleware for capturing sensitive state-changing operations (POST, PUT, DELETE).
 */
export function auditLogger(entityName: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    res.send = function (body?: any): Response {
      // Capture after response is finished successfully
      if (res.statusCode >= 200 && res.statusCode < 300 && ["POST", "PUT", "DELETE"].includes(req.method)) {
        const userId = req.user?.userId || null;
        const ipAddress = req.ip || req.socket.remoteAddress || "unknown";

        prisma.auditLog
          .create({
            data: {
              userId,
              action: `${req.method}_${req.originalUrl.split("/").pop()?.toUpperCase() || "ACTION"}`,
              entity: entityName,
              ipAddress,
              payloadAfter: JSON.stringify({
                path: req.originalUrl,
                method: req.method,
                user: req.user?.email || "Anonymous",
              }),
            },
          })
          .catch((err) => console.error("⚠️ Audit log creation failed:", err));
      }

      return originalSend.call(this, body);
    };

    next();
  };
}
