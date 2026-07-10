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

export async function getRequestById(requestId: string, userId: string) {
  return prisma.request.findFirst({
    where: {
      id: requestId,
      requesterId: userId,
    },
  });
}

export async function updateRequestStatus(
  requestId: string,
  status: "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED"
) {
  const existingRequest = await prisma.request.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!existingRequest) {
    return null;
  }

  return prisma.request.update({
    where: {
      id: requestId,
    },
    data: {
      status,
      resolvedAt:
        status === "RESOLVED" || status === "CLOSED"
          ? new Date()
          : null,
    },
  });
}