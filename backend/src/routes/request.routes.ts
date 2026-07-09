import { Router } from "express";
import {
  createRequestHandler,
  getMyRequestsHandler,
  getRequestByIdHandler,
} from "../controllers/request.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, createRequestHandler);
router.get("/mine", requireAuth, getMyRequestsHandler);
router.get("/:id", requireAuth, getRequestByIdHandler);

export default router;