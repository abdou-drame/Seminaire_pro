import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { InitiatePaymentSchema } from "../dtos";

const router = Router();

// Webhook System Callbacks (No auth token required, IP / Signature validation in prod)
router.post("/webhook/wave", PaymentController.waveWebhook);
router.post("/webhook/orange", PaymentController.orangeWebhook);

// Protected Payment Endpoints
router.use(authenticate);

router.post(
  "/initiate",
  authorizeRoles(["ORG_ADMIN", "ORG_FINANCE"]),
  validate(InitiatePaymentSchema),
  PaymentController.initiate
);

router.get(
  "/status/:transactionRef",
  authorizeRoles(["ORG_ADMIN", "ORG_FINANCE", "HOTEL_ADMIN", "HOTEL_FINANCE"]),
  PaymentController.getStatus
);

export default router;
