import { prisma } from "../config/prisma";

type CreateRequestInput = {
  title: string;
  description: string;
  category: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  requesterId: string;
};

export async function createRequest(input: CreateRequestInput) {
  return prisma.request.create({
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      priority: input.priority ?? "MEDIUM",
      requesterId: input.requesterId,
    },
  });
}

export async function getRequestsForUser(userId: string) {
  return prisma.request.findMany({
    where: {
      requesterId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}