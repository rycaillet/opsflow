import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || "5001",
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "dev_super_secret_change_later",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};