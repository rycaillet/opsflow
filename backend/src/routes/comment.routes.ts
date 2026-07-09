import { Router } from "express";
import {
  createCommentHandler,
  getCommentsHandler,
} from "../controllers/comment.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/:requestId/comments", requireAuth, getCommentsHandler);
router.post("/:requestId/comments", requireAuth, createCommentHandler);

export default router;