import { Request, Response, NextFunction } from "express";
import { EstablishmentService } from "../services/establishment.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class EstablishmentController {
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EstablishmentService.search({
        city: req.query.city as string,
        standingStars: req.query.standingStars ? Number(req.query.standingStars) : undefined,
        type: req.query.type as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      });

      return res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  static async mapSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const lat = Number(req.query.latitude);
      const lng = Number(req.query.longitude);
      const radiusKm = req.query.radiusKm ? Number(req.query.radiusKm) : 10;

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Coordonnées latitude/longitude requises." },
        });
      }

      const result = await EstablishmentService.mapSearch(lat, lng, radiusKm);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const establishment = await EstablishmentService.getById(req.params.id);
      return res.status(200).json({ success: true, data: establishment });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hotelId = req.user?.hotelId;
      if (!hotelId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucun hôtel associé." },
        });
      }

      const updated = await EstablishmentService.updateProfile(hotelId, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async addMeetingRoom(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hotelId = req.user?.hotelId;
      if (!hotelId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucun hôtel associé." },
        });
      }

      const room = await EstablishmentService.addMeetingRoom(hotelId, req.body);
      return res.status(201).json({ success: true, data: room });
    } catch (err) {
      next(err);
    }
  }

  static async addBedroom(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hotelId = req.user?.hotelId;
      if (!hotelId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucun hôtel associé." },
        });
      }

      const bedroom = await EstablishmentService.addBedroom(hotelId, req.body);
      return res.status(201).json({ success: true, data: bedroom });
    } catch (err) {
      next(err);
    }
  }

  static async addPackage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hotelId = req.user?.hotelId;
      if (!hotelId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucun hôtel associé." },
        });
      }

      const pkg = await EstablishmentService.addPackage(hotelId, req.body);
      return res.status(201).json({ success: true, data: pkg });
    } catch (err) {
      next(err);
    }
  }

  static async addAvailabilityBlock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hotelId = req.user?.hotelId;
      if (!hotelId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucun hôtel associé." },
        });
      }

      const block = await EstablishmentService.addAvailabilityBlock(hotelId, req.body);
      return res.status(201).json({ success: true, data: block });
    } catch (err) {
      next(err);
    }
  }

  static async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hotelId = req.user?.hotelId;
      if (!hotelId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucun hôtel associé." },
        });
      }

      const dashboard = await EstablishmentService.getDashboard(hotelId);
      return res.status(200).json({ success: true, data: dashboard });
    } catch (err) {
      next(err);
    }
  }
}
