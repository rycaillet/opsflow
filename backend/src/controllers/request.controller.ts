import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  assignRequestToUser,
  createRequest,
  getAllRequests,
  getRequestById,
  getRequestsForUser,
  updateRequestStatus,
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

export async function getAllRequestsHandler(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const requests = await getAllRequests();

  return res.status(200).json(requests);
}

export async function getRequestByIdHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

const requestId = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

if (!requestId) {
  return res.status(400).json({ message: "Request ID is required." });
}

const request = await getRequestById(
  requestId,
  req.user.userId,
  req.user.role
);

  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }

  return res.status(200).json(request);
}

export async function updateRequestStatusHandler(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const requestId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!requestId) {
    return res.status(400).json({ message: "Request ID is required." });
  }

  const { status } = req.body;

  const validStatuses = ["OPEN", "IN_PROGRESS", "WAITING", "RESOLVED", "CLOSED"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  const request = await updateRequestStatus(
    requestId,
    status
  );

  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }

  return res.status(200).json(request);
}

export async function assignRequestToSelfHandler(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const requestId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!requestId) {
    return res.status(400).json({
      message: "Request ID is required.",
    });
  }

  const request = await assignRequestToUser(
    requestId,
    req.user.userId
  );

  if (!request) {
    return res.status(404).json({
      message: "Request not found.",
    });
  }

  return res.status(200).json(request);
}