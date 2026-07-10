import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";

type CreateCommentInput = {
  requestId: string;
  authorId: string;
  authorRole: Role;
  body: string;
};

function getRequestAccessWhere(
  requestId: string,
  userId: string,
  role: Role
) {
  return {
    id: requestId,
    ...(role === Role.EMPLOYEE
      ? {
          requesterId: userId,
        }
      : {}),
  };
}

export async function getCommentsForRequest(
  requestId: string,
  userId: string,
  role: Role
) {
  const request = await prisma.request.findFirst({
    where: getRequestAccessWhere(requestId, userId, role),
  });

  if (!request) {
    return null;
  }

  return prisma.comment.findMany({
    where: {
      requestId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function createComment(input: CreateCommentInput) {
  const request = await prisma.request.findFirst({
    where: getRequestAccessWhere(
      input.requestId,
      input.authorId,
      input.authorRole
    ),
  });

  if (!request) {
    return null;
  }

  return prisma.comment.create({
    data: {
      requestId: input.requestId,
      authorId: input.authorId,
      body: input.body.trim(),
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
}