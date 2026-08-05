import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/auth";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware to verify JWT authentication token from Authorization header.
 */
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Jeton d'authentification manquant." },
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Jeton invalide ou expiré." },
    });
  }

  req.user = decoded;
  next();
}
