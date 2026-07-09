import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/health.routes";
import { env } from "./config/env";

const app = express();

app.use(cors({
  origin: env.clientUrl,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/health", healthRoutes);

export default app;