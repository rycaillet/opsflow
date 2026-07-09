import { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../services/jwt.service";

export type AuthUser = {
  userId: string;
  role: string;
};

export type AuthRequest = Request & {
  user?: AuthUser;
};

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const decoded = verifyAuthToken(token);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}