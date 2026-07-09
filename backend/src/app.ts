import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/health.routes";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import requestRoutes from "./routes/request.routes";
import commentRoutes from "./routes/comment.routes";

const app = express();

app.use(cors({
  origin: env.clientUrl,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/requests", commentRoutes);

export default app;