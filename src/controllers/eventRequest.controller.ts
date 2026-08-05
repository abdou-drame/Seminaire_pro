import { Response, NextFunction } from "express";
import { EventRequestService } from "../services/eventRequest.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class EventRequestController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucune organisation associée." },
        });
      }

      const rfq = await EventRequestService.create(req.body, orgId);
      return res.status(201).json({ success: true, data: rfq });
    } catch (err) {
      next(err);
    }
  }

  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucune organisation associée." },
        });
      }

      const status = req.query.status as string | undefined;
      const rfqs = await EventRequestService.listByOrganization(orgId, status);
      return res.status(200).json({ success: true, data: rfqs });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const rfq = await EventRequestService.getById(req.params.id);
      return res.status(200).json({ success: true, data: rfq });
    } catch (err) {
      next(err);
    }
  }

  static async sendReminder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await EventRequestService.sendReminder(req.params.id);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const messages = await EventRequestService.getMessages(req.params.id);
      return res.status(200).json({ success: true, data: messages });
    } catch (err) {
      next(err);
    }
  }

  static async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const senderId = req.user?.userId;
      if (!senderId) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Non authentifié." },
        });
      }

      const message = await EventRequestService.sendMessage(req.params.id, senderId, req.body);
      return res.status(201).json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }

  static async generateComparisonMatrix(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const matrix = await EventRequestService.generateComparisonMatrix(req.params.id);
      return res.status(200).json({ success: true, data: matrix });
    } catch (err) {
      next(err);
    }
  }
}
