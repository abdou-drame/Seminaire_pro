import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/pending-hotels",
  authorizeRoles(["SUPER_ADMIN", "PARTNER_MANAGER"]),
  AdminController.getPendingHotels
);

router.post(
  "/hotels/:id/validate",
  authorizeRoles(["SUPER_ADMIN", "PARTNER_MANAGER"]),
  AdminController.validateHotel
);

router.get(
  "/dashboard",
  authorizeRoles(["SUPER_ADMIN", "FINANCIAL_MANAGER"]),
  AdminController.getDashboard
);

router.get(
  "/commissions",
  authorizeRoles(["SUPER_ADMIN", "FINANCIAL_MANAGER"]),
  AdminController.getCommissions
);

router.get(
  "/audit-logs",
  authorizeRoles(["SUPER_ADMIN"]),
  AdminController.getAuditLogs
);

export default router;
