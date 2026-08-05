import { Router } from "express";
import { EventRequestController } from "../controllers/eventRequest.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CreateEventRequestSchema, SendMessageSchema } from "../dtos";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER"]),
  validate(CreateEventRequestSchema),
  EventRequestController.create
);

router.get(
  "/",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER", "ORG_LOGISTICS", "ORG_FINANCE", "ORG_APPROVER", "ORG_VIEWER"]),
  EventRequestController.list
);

router.get(
  "/:id",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER", "ORG_LOGISTICS", "ORG_FINANCE", "ORG_APPROVER", "HOTEL_ADMIN", "HOTEL_COMMERCIAL", "HOTEL_RESERVATION"]),
  EventRequestController.getById
);

router.post(
  "/:id/remind",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER"]),
  EventRequestController.sendReminder
);

router.get(
  "/:id/messages",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER", "ORG_LOGISTICS", "HOTEL_ADMIN", "HOTEL_COMMERCIAL"]),
  EventRequestController.getMessages
);

router.post(
  "/:id/messages",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER", "ORG_LOGISTICS", "HOTEL_ADMIN", "HOTEL_COMMERCIAL"]),
  validate(SendMessageSchema),
  EventRequestController.sendMessage
);

router.post(
  "/:id/compare",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER", "ORG_LOGISTICS", "ORG_FINANCE", "ORG_APPROVER"]),
  EventRequestController.generateComparisonMatrix
);

export default router;
