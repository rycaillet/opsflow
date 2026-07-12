import { Role } from "@prisma/client";
import { Router } from "express";
import { getAnalyticsSummaryHandler } from "../controllers/analytics.controller";
import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/summary",
  requireAuth,
  requireRole(Role.MANAGER, Role.ADMIN),
  getAnalyticsSummaryHandler
);

export default router;