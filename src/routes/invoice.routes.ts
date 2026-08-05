import { Router } from "express";
import { InvoiceController } from "../controllers/invoice.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/:reservationId",
  authorizeRoles(["ORG_ADMIN", "ORG_FINANCE", "HOTEL_ADMIN", "HOTEL_FINANCE"]),
  InvoiceController.getInvoice
);

export default router;
