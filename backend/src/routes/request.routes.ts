import { Router } from "express";
import {
  createRequestHandler,
  getMyRequestsHandler,
} from "../controllers/request.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, createRequestHandler);
router.get("/mine", requireAuth, getMyRequestsHandler);

export default router;