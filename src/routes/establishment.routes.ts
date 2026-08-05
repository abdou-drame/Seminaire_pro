import { Router } from "express";
import { EstablishmentController } from "../controllers/establishment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  UpdateHotelProfileSchema,
  CreateMeetingRoomSchema,
  CreateBedroomSchema,
  CreatePackageSchema,
  CreateAvailabilityBlockSchema,
} from "../dtos";

const router = Router();

// Public Search Endpoints
router.get("/search", EstablishmentController.search);
router.get("/map", EstablishmentController.mapSearch);
router.get("/:id", EstablishmentController.getById);

// Protected Hotel Partner Endpoints
router.use(authenticate);

router.put(
  "/my-profile",
  authorizeRoles(["HOTEL_ADMIN"]),
  validate(UpdateHotelProfileSchema),
  EstablishmentController.updateProfile
);

router.post(
  "/meeting-rooms",
  authorizeRoles(["HOTEL_ADMIN"]),
  validate(CreateMeetingRoomSchema),
  EstablishmentController.addMeetingRoom
);

router.post(
  "/bedrooms",
  authorizeRoles(["HOTEL_ADMIN"]),
  validate(CreateBedroomSchema),
  EstablishmentController.addBedroom
);

router.post(
  "/packages",
  authorizeRoles(["HOTEL_ADMIN"]),
  validate(CreatePackageSchema),
  EstablishmentController.addPackage
);

router.post(
  "/availability-blocks",
  authorizeRoles(["HOTEL_RESERVATION", "HOTEL_ADMIN"]),
  validate(CreateAvailabilityBlockSchema),
  EstablishmentController.addAvailabilityBlock
);

router.get(
  "/dashboard",
  authorizeRoles(["HOTEL_ADMIN", "HOTEL_COMMERCIAL", "HOTEL_RESERVATION", "HOTEL_FINANCE"]),
  EstablishmentController.getDashboard
);

export default router;
