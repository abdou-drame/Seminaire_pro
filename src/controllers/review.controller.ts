import { Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class ReviewController {
  static async createReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Non authentifié." },
        });
      }

      const review = await ReviewService.createReview(req.body, userId);
      return res.status(201).json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }

  static async moderateReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Non authentifié." },
        });
      }

      const { approve } = req.body;
      const review = await ReviewService.moderateReview(req.params.id, Boolean(approve), userId);
      return res.status(200).json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }
}
