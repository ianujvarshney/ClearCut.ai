import { Router } from "express";
import { validate } from "@/middlewares/validate.middleware";
import { AuthController } from "../controllers/auth.controller";
import { emailSchema, loginSchema, refreshSchema, registerSchema, resetPasswordSchema } from "../validators/auth.validator";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), AuthController.register);
authRouter.post("/login", validate(loginSchema), AuthController.login);
authRouter.post("/refresh", validate(refreshSchema), AuthController.refresh);
authRouter.post("/logout", validate(refreshSchema), AuthController.logout);
authRouter.post("/verify-email", AuthController.verifyEmail);
authRouter.post("/forgot-password", validate(emailSchema), AuthController.forgotPassword);
authRouter.post("/reset-password", validate(resetPasswordSchema), AuthController.resetPassword);
authRouter.get("/:provider(google|github)", AuthController.oauth);
authRouter.get("/:provider(google|github)/callback", AuthController.oauth);
