import { Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class NotificationController {
  static async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Non authentifié." },
        });
      }

      const notifications = await NotificationService.getUserNotifications(userId);
      return res.status(200).json({ success: true, data: notifications });
    } catch (err) {
      next(err);
    }
  }
}
