import { Router } from "express";
import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { AdminController } from "../controllers/admin.controller";

export const adminRouter = Router();

adminRouter.use(authenticate, authorize("admin"));
adminRouter.get("/users", AdminController.users);
adminRouter.post("/users/:userId/suspend", AdminController.suspendUser);
adminRouter.get("/analytics", AdminController.analytics);
adminRouter.get("/logs", AdminController.logs);
adminRouter.get("/abuse", AdminController.abuse);
