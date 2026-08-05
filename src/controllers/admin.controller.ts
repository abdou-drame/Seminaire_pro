import { Response, NextFunction } from "express";
import { AdminService } from "../services/admin.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class AdminController {
  static async getPendingHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hotels = await AdminService.getPendingHotels();
      return res.status(200).json({ success: true, data: hotels });
    } catch (err) {
      next(err);
    }
  }

  static async validateHotel(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const adminUserId = req.user?.userId;
      if (!adminUserId) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Non authentifié." },
        });
      }

      const { approve } = req.body;
      const result = await AdminService.validateHotel(req.params.id, Boolean(approve), adminUserId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dashboard = await AdminService.getDashboard();
      return res.status(200).json({ success: true, data: dashboard });
    } catch (err) {
      next(err);
    }
  }

  static async getCommissions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const commissions = await AdminService.getCommissions();
      return res.status(200).json({ success: true, data: commissions });
    } catch (err) {
      next(err);
    }
  }

  static async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const logs = await AdminService.getAuditLogs(limit);
      return res.status(200).json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  }
}
