import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

/**
 * Middleware restricting access based on allowed user roles (Global, Org, or Hotel roles).
 * @param allowedRoles Array of allowed role strings
 */
export function authorizeRoles(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Utilisateur non authentifié." },
      });
    }

    const userRoles = [
      req.user.globalRole,
      req.user.orgRole,
      req.user.hotelRole,
    ].filter(Boolean);

    const hasPermission = allowedRoles.some((role) => userRoles.includes(role as string));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "Accès refusé. Droits insuffisants." },
      });
    }

    next();
  };
}
