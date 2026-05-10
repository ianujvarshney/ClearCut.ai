import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { DeveloperController } from "../controllers/developer.controller";

export const developerRouter = Router();

developerRouter.use(authenticate);
developerRouter.get("/keys", DeveloperController.listKeys);
developerRouter.post("/keys", DeveloperController.createKey);
developerRouter.delete("/keys/:keyId", DeveloperController.revokeKey);
developerRouter.get("/usage", DeveloperController.usage);
developerRouter.get("/docs", DeveloperController.docs);
