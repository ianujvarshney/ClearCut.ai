import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/upload.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { UserController } from "../controllers/user.controller";
import { changePasswordSchema, updateProfileSchema } from "../validators/user.validator";

export const userRouter = Router();

userRouter.use(authenticate);
userRouter.get("/me", UserController.me);
userRouter.patch("/me", validate(updateProfileSchema), UserController.updateMe);
userRouter.post("/me/avatar", upload.single("avatar"), UserController.uploadAvatar);
userRouter.post("/me/change-password", validate(changePasswordSchema), UserController.changePassword);
userRouter.delete("/me", UserController.deleteMe);
userRouter.get("/me/activity", UserController.activity);
userRouter.get("/me/subscription", UserController.subscriptions);
