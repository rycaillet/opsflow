import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../services/jwt.service";

export type AuthUser = {
  userId: string;
  role: Role;
};

export type AuthRequest = Request & {
  user?: AuthUser;
};

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const token = authorizationHeader.slice("Bearer ".length);

  try {
    const decoded = verifyAuthToken(token);
    req.user = decoded;

    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}

export function requireRole(...allowedRoles: Role[]) {
  return function (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }

    return next();
  };
}