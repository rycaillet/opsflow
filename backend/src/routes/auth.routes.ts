import { Router } from "express";
import {
  changePassword,
  getMe,
  login,
  register,
  updateProfile,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.patch(
  "/profile",
  requireAuth,
  updateProfile
);

router.patch(
  "/password",
  requireAuth,
  changePassword
);

export default router;