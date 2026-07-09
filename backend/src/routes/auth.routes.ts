import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { requireAuth, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", requireAuth, (req: AuthRequest, res) => {
  res.status(200).json({
    message: "Authenticated",
    user: req.user,
  });
});

export default router;