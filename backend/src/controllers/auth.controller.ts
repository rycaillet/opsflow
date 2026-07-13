import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  changeUserPassword,
  getCurrentUser,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  try {
    const user = await getCurrentUser(userId);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

export async function updateProfile(
  req: AuthRequest,
  res: Response
) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  try {
    const user = await updateUserProfile(
      userId,
      req.body
    );

    return res.status(200).json({
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

export async function changePassword(
  req: AuthRequest,
  res: Response
) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  try {
    await changeUserPassword(
      userId,
      req.body
    );

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}