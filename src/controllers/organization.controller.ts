import { Response, NextFunction } from "express";
import { OrganizationService } from "../services/organization.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class OrganizationController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucune organisation associée." },
        });
      }

      const org = await OrganizationService.getProfile(orgId);
      return res.status(200).json({ success: true, data: org });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucune organisation associée." },
        });
      }

      const updated = await OrganizationService.updateProfile(orgId, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucune organisation associée." },
        });
      }

      const users = await OrganizationService.getUsers(orgId);
      return res.status(200).json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  }

  static async addUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucune organisation associée." },
        });
      }

      const newUser = await OrganizationService.addUser(orgId, req.body);
      return res.status(201).json({ success: true, data: newUser });
    } catch (err) {
      next(err);
    }
  }

  static async removeUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      const { userId } = req.params;
      if (!orgId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucune organisation associée." },
        });
      }

      await OrganizationService.removeUser(orgId, userId);
      return res.status(200).json({ success: true, data: { message: "Collaborateur retiré." } });
    } catch (err) {
      next(err);
    }
  }

  static async updateApprovalWorkflow(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucune organisation associée." },
        });
      }

      const updated = await OrganizationService.updateApprovalWorkflow(orgId, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Aucune organisation associée." },
        });
      }

      const dashboard = await OrganizationService.getDashboard(orgId);
      return res.status(200).json({ success: true, data: dashboard });
    } catch (err) {
      next(err);
    }
  }
}
