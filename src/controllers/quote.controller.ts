import { Response, NextFunction } from "express";
import { QuoteService } from "../services/quote.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class QuoteController {
  static async createQuote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hotelId = req.user?.hotelId;
      if (!hotelId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucun hôtel associé." },
        });
      }

      const quote = await QuoteService.createQuote(req.body, hotelId);
      return res.status(201).json({ success: true, data: quote });
    } catch (err) {
      next(err);
    }
  }

  static async getReceivedQuotes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucune organisation associée." },
        });
      }

      const quotes = await QuoteService.getReceivedQuotes(orgId);
      return res.status(200).json({ success: true, data: quotes });
    } catch (err) {
      next(err);
    }
  }

  static async acceptQuote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Non authentifié." },
        });
      }

      const result = await QuoteService.acceptQuote(req.params.id, userId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async rejectQuote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Non authentifié." },
        });
      }

      const result = await QuoteService.rejectQuote(req.params.id, userId, req.body.notes);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
