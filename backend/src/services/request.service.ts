import { Role } from "@prisma/client";
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

export async function getRequestById(
  requestId: string,
  userId: string,
  role: Role
) {
  return prisma.request.findFirst({
    where: {
      id: requestId,
      ...(role === Role.EMPLOYEE
        ? {
            requesterId: userId,
          }
        : {}),
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function getAllRequests() {
  return prisma.request.findMany({
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
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

export async function assignRequestToUser(
  requestId: string,
  assigneeId: string
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
      assigneeId,
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}