import { Router } from "express";
import { authRouter } from "@/modules/auth/routes/auth.routes";
import { userRouter } from "@/modules/users/routes/user.routes";
import { imageRouter } from "@/modules/images/routes/image.routes";
import { billingRouter } from "@/modules/billing/routes/billing.routes";
import { dashboardRouter } from "@/modules/dashboard/routes/dashboard.routes";
import { adminRouter } from "@/modules/admin/routes/admin.routes";
import { developerRouter } from "@/modules/developer/routes/developer.routes";
import { contentRouter } from "@/modules/content/routes/content.routes";
import { notificationRouter } from "@/modules/notifications/routes/notification.routes";
import { publicApiRouter } from "@/modules/public-api.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/images", imageRouter);
apiRouter.use("/billing", billingRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/developer", developerRouter);
apiRouter.use("/content", contentRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/public", publicApiRouter);
