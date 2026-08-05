import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { RegisterOrgSchema, RegisterHotelSchema, LoginSchema, ForgotPasswordSchema } from "../dtos";

const router = Router();

router.post("/register/organization", validate(RegisterOrgSchema), AuthController.registerOrg);
router.post("/register/hotel", validate(RegisterHotelSchema), AuthController.registerHotel);
router.post("/login", validate(LoginSchema), AuthController.login);
router.post("/forgot-password", validate(ForgotPasswordSchema), AuthController.forgotPassword);
router.get("/me", authenticate, AuthController.getMe);

export default router;
