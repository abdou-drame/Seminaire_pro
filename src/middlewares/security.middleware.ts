import { Request, Response, NextFunction } from "express";

/**
 * Sanitizes strings recursively to prevent XSS (Cross-Site Scripting) attacks.
 */
function sanitizeValue(value: any): any {
  if (typeof value === "string") {
    // Strip script tags and dangerous HTML attributes
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/onerror=/gi, "")
      .replace(/onload=/gi, "");
  }
  if (typeof value === "object" && value !== null) {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        value[key] = sanitizeValue(value[key]);
      }
    }
  }
  return value;
}

/**
 * OWASP Input Sanitization Middleware.
 */
export function sanitizeInputs(req: Request, res: Response, next: NextFunction) {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
}

/**
 * In-Memory Rate Limiter Middleware to prevent Brute Force & DDOS.
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown_ip";
    const now = Date.now();

    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count += 1;

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Trop de requêtes effectuées. Veuillez réessayer ultérieurement.",
        },
      });
    }

    next();
  };
}
