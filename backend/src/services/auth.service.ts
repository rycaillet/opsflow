import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";
import { hashPassword } from "./password.service";
import { signAuthToken } from "./jwt.service";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error("Email is already in use.");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: Role.EMPLOYEE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const token = signAuthToken({
    userId: user.id,
    role: user.role,
  });

  return { user, token };
}