import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getAnalyticsSummary } from "../services/analytics.service";

export async function getAnalyticsSummaryHandler(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  try {
    const summary = await getAnalyticsSummary();

    return res.status(200).json(summary);
  } catch (error) {
    console.error("Unable to load analytics summary:", error);

    return res.status(500).json({
      message: "Unable to load analytics summary.",
    });
  }
}