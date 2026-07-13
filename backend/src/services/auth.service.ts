import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";
import { signAuthToken } from "./jwt.service";
import { hashPassword, verifyPassword } from "./password.service";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type UpdateProfileInput = {
  name: string;
};

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
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

  return {
    user,
    token,
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await verifyPassword(
    input.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = signAuthToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}

export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput
) {
  const name = input.name?.trim();

  if (!name) {
    throw new Error("Name is required.");
  }

  if (name.length < 2) {
    throw new Error("Name must be at least 2 characters.");
  }

  if (name.length > 100) {
    throw new Error("Name must be 100 characters or fewer.");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function changeUserPassword(
  userId: string,
  input: ChangePasswordInput
) {
  if (!input.currentPassword || !input.newPassword) {
    throw new Error(
      "Current password and new password are required."
    );
  }

  if (input.newPassword.length < 8) {
    throw new Error(
      "New password must be at least 8 characters."
    );
  }

  if (input.currentPassword === input.newPassword) {
    throw new Error(
      "New password must be different from the current password."
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const isCurrentPasswordValid = await verifyPassword(
    input.currentPassword,
    user.passwordHash
  );

  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect.");
  }

  const passwordHash = await hashPassword(
    input.newPassword
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash,
    },
  });
}

