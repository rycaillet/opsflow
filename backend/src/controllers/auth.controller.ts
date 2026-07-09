import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);

    res.status(201).json(result);
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

    res.status(200).json(result);
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