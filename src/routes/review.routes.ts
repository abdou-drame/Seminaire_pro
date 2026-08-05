import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CreateReviewSchema } from "../dtos";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER"]),
  validate(CreateReviewSchema),
  ReviewController.createReview
);

router.put(
  "/:id/moderate",
  authorizeRoles(["SUPER_ADMIN", "MODERATOR"]),
  ReviewController.moderateReview
);

export default router;
