import { Router } from "express";
import { OrganizationController } from "../controllers/organization.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { UpdateOrgProfileSchema, AddOrgUserSchema, UpdateApprovalWorkflowSchema } from "../dtos";

const router = Router();

router.use(authenticate);

router.get(
  "/profile",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER", "ORG_LOGISTICS", "ORG_FINANCE", "ORG_APPROVER", "ORG_VIEWER"]),
  OrganizationController.getProfile
);

router.put(
  "/profile",
  authorizeRoles(["ORG_ADMIN"]),
  validate(UpdateOrgProfileSchema),
  OrganizationController.updateProfile
);

router.get(
  "/users",
  authorizeRoles(["ORG_ADMIN"]),
  OrganizationController.getUsers
);

router.post(
  "/users",
  authorizeRoles(["ORG_ADMIN"]),
  validate(AddOrgUserSchema),
  OrganizationController.addUser
);

router.delete(
  "/users/:userId",
  authorizeRoles(["ORG_ADMIN"]),
  OrganizationController.removeUser
);

router.put(
  "/approval-workflow",
  authorizeRoles(["ORG_ADMIN"]),
  validate(UpdateApprovalWorkflowSchema),
  OrganizationController.updateApprovalWorkflow
);

router.get(
  "/dashboard",
  authorizeRoles(["ORG_ADMIN", "ORG_REQUESTER", "ORG_LOGISTICS", "ORG_FINANCE", "ORG_APPROVER"]),
  OrganizationController.getDashboard
);

export default router;
