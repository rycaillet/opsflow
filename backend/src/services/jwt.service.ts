import { Role } from "@prisma/client";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

type TokenPayload = {
  userId: string;
  role: Role;
};

const signOptions: SignOptions = {
  expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
};

export function signAuthToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, signOptions);
}

export function verifyAuthToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
}