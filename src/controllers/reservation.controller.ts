import { Response, NextFunction } from "express";
import { ReservationService } from "../services/reservation.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class ReservationController {
  static async holdOption(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucune organisation associée." },
        });
      }

      const reservation = await ReservationService.holdOption(req.body, orgId);
      return res.status(201).json({ success: true, data: reservation });
    } catch (err) {
      next(err);
    }
  }

  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      const hotelId = req.user?.hotelId;
      const status = req.query.status as string | undefined;

      const reservations = await ReservationService.list({
        organizationId: orgId,
        establishmentId: hotelId,
        status,
      });

      return res.status(200).json({ success: true, data: reservations });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reservation = await ReservationService.getById(req.params.id);
      return res.status(200).json({ success: true, data: reservation });
    } catch (err) {
      next(err);
    }
  }

  static async approve(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const approverId = req.user?.userId;
      if (!approverId) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Non authentifié." },
        });
      }

      const result = await ReservationService.approve(req.body, approverId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async cancel(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Non authentifié." },
        });
      }

      const result = await ReservationService.cancel(req.params.id, userId, req.body.reason);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
