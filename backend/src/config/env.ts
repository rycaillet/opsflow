import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? "development";
const isProduction = nodeEnv === "production";

function requireProductionValue(
  name: string,
  developmentFallback?: string
) {
  const value = process.env[name];

  if (value) {
    return value;
  }

  if (!isProduction && developmentFallback !== undefined) {
    return developmentFallback;
  }

  throw new Error(
    `Missing required environment variable: ${name}`
  );
}

function parsePort(value: string | undefined) {
  const port = Number(value ?? "5001");

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a valid positive integer.");
  }

  return port;
}

export const env = {
  port: parsePort(process.env.PORT),
  nodeEnv,
  isProduction,
  clientUrl: requireProductionValue(
    "CLIENT_URL",
    "http://localhost:5173"
  ),
  databaseUrl: requireProductionValue(
    "DATABASE_URL",
    "postgresql://username@localhost:5432/opsflow_dev?schema=public"
  ),
  jwtSecret: requireProductionValue(
    "JWT_SECRET",
    "dev_super_secret_change_later"
  ),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
};