import { prisma } from "../config/prisma";

type CreateCommentInput = {
  requestId: string;
  authorId: string;
  body: string;
};

export async function getCommentsForRequest(requestId: string, userId: string) {
  const request = await prisma.request.findFirst({
    where: {
      id: requestId,
      requesterId: userId,
    },
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
    where: {
      id: input.requestId,
      requesterId: input.authorId,
    },
  });

  if (!request) {
    return null;
  }

  return prisma.comment.create({
    data: {
      requestId: input.requestId,
      authorId: input.authorId,
      body: input.body,
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