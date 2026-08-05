import { Router } from "express";
import { QuoteController } from "../controllers/quote.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CreateQuoteSchema } from "../dtos";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizeRoles(["HOTEL_ADMIN", "HOTEL_COMMERCIAL"]),
  validate(CreateQuoteSchema),
  QuoteController.createQuote
);

router.get(
  "/received",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER", "ORG_LOGISTICS", "ORG_FINANCE", "ORG_APPROVER"]),
  QuoteController.getReceivedQuotes
);

router.post(
  "/:id/accept",
  authorizeRoles(["ORG_ADMIN", "ORG_APPROVER"]),
  QuoteController.acceptQuote
);

router.post(
  "/:id/reject",
  authorizeRoles(["ORG_ADMIN", "ORG_APPROVER"]),
  QuoteController.rejectQuote
);

export default router;
