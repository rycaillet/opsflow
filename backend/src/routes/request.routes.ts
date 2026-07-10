import { Role } from "@prisma/client";
import { Router } from "express";
import {
  createRequestHandler,
  getAllRequestsHandler,
  getMyRequestsHandler,
  getRequestByIdHandler,
  updateRequestStatusHandler,
} from "../controllers/request.controller";
import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, createRequestHandler);
router.get("/mine", requireAuth, getMyRequestsHandler);
router.get(
  "/",
  requireAuth,
  requireRole(Role.STAFF, Role.MANAGER, Role.ADMIN),
  getAllRequestsHandler
);
router.get("/:id", requireAuth, getRequestByIdHandler);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole(Role.STAFF, Role.MANAGER, Role.ADMIN),
  updateRequestStatusHandler
);

export default router;