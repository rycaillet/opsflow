import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createComment,
  getCommentsForRequest,
} from "../services/comment.service";

function getParamId(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function getCommentsHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const requestId = getParamId(req.params.requestId);

  if (!requestId) {
    return res.status(400).json({ message: "Request ID is required." });
  }

  const comments = await getCommentsForRequest(
    requestId,
    req.user.userId,
    req.user.role
  );

  if (!comments) {
    return res.status(404).json({ message: "Request not found." });
  }

  return res.status(200).json(comments);
}

export async function createCommentHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const requestId = getParamId(req.params.requestId);

  if (!requestId) {
    return res.status(400).json({ message: "Request ID is required." });
  }

  if (typeof req.body.body !== "string" ||!req.body.body.trim()) {
    return res.status(400).json({ message: "Comment body is required." });
  }

  const comment = await createComment({
    requestId,
    authorId: req.user.userId,
    authorRole: req.user.role,
    body: req.body.body,
  });

  if (!comment) {
    return res.status(404).json({ message: "Request not found." });
  }

  return res.status(201).json(comment);
}