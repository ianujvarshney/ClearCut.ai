import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { DashboardController } from "../controllers/dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);
dashboardRouter.get("/overview", DashboardController.overview);
dashboardRouter.get("/usage", DashboardController.usage);
dashboardRouter.get("/reports/monthly", DashboardController.reports);
