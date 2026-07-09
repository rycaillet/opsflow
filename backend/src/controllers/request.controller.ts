import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createRequest,
  getRequestsForUser,
} from "../services/request.service";

export async function createRequestHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const request = await createRequest({
    ...req.body,
    requesterId: req.user.userId,
  });

  return res.status(201).json(request);
}

export async function getMyRequestsHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const requests = await getRequestsForUser(req.user.userId);

  return res.status(200).json(requests);
}