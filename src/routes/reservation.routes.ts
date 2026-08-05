import { Router } from "express";
import { ReservationController } from "../controllers/reservation.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { HoldOptionSchema, SubmitApprovalSchema } from "../dtos";

const router = Router();

router.use(authenticate);

router.post(
  "/hold-option",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER", "ORG_LOGISTICS"]),
  validate(HoldOptionSchema),
  ReservationController.holdOption
);

router.get(
  "/",
  authorizeRoles([
    "ORG_ADMIN",
    "ORG_REQUESTER",
    "ORG_LOGISTICS",
    "ORG_FINANCE",
    "ORG_APPROVER",
    "ORG_VIEWER",
    "HOTEL_ADMIN",
    "HOTEL_COMMERCIAL",
    "HOTEL_RESERVATION",
    "HOTEL_FINANCE",
    "HOTEL_RECEPTION",
  ]),
  ReservationController.list
);

router.get(
  "/:id",
  authorizeRoles([
    "ORG_ADMIN",
    "ORG_REQUESTER",
    "ORG_LOGISTICS",
    "ORG_FINANCE",
    "ORG_APPROVER",
    "HOTEL_ADMIN",
    "HOTEL_COMMERCIAL",
    "HOTEL_RESERVATION",
    "HOTEL_FINANCE",
  ]),
  ReservationController.getById
);

router.post(
  "/approve",
  authorizeRoles(["ORG_ADMIN", "ORG_APPROVER", "ORG_FINANCE"]),
  validate(SubmitApprovalSchema),
  ReservationController.approve
);

router.post(
  "/:id/cancel",
  authorizeRoles([
    "ORG_ADMIN",
    "ORG_REQUESTER",
    "ORG_APPROVER",
    "HOTEL_ADMIN",
    "HOTEL_RESERVATION",
  ]),
  ReservationController.cancel
);

export default router;
