import { prisma } from "../config/prisma";

const ACTIVE_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING",
] as const;

const COMPLETED_STATUSES = [
  "RESOLVED",
  "CLOSED",
] as const;

export async function getAnalyticsSummary() {
  const [
    totalRequests,
    openRequests,
    resolvedRequests,
    highPriorityRequests,
    completedRequestDates,
    requestsByStatus,
    requestsByPriority,
    requestsByCategory,
    assignedRequests,
  ] = await Promise.all([
    prisma.request.count(),

    prisma.request.count({
      where: {
        status: {
          in: [...ACTIVE_STATUSES],
        },
      },
    }),

    prisma.request.count({
      where: {
        status: {
          in: [...COMPLETED_STATUSES],
        },
      },
    }),

    prisma.request.count({
      where: {
        priority: {
          in: ["HIGH", "URGENT"],
        },
      },
    }),

    prisma.request.findMany({
      where: {
        resolvedAt: {
          not: null,
        },
      },
      select: {
        createdAt: true,
        resolvedAt: true,
      },
    }),

    prisma.request.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),

    prisma.request.groupBy({
      by: ["priority"],
      _count: {
        _all: true,
      },
    }),

    prisma.request.groupBy({
      by: ["category"],
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          category: "desc",
        },
      },
    }),

    prisma.request.groupBy({
      by: ["assigneeId"],
      where: {
        assigneeId: {
          not: null,
        },
        status: {
          in: [...ACTIVE_STATUSES],
        },
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  const totalResolutionMilliseconds =
    completedRequestDates.reduce((total, request) => {
      if (!request.resolvedAt) {
        return total;
      }

      return (
        total +
        (request.resolvedAt.getTime() -
          request.createdAt.getTime())
      );
    }, 0);

  const averageResolutionHours =
    completedRequestDates.length > 0
      ? totalResolutionMilliseconds /
        completedRequestDates.length /
        1000 /
        60 /
        60
      : 0;

  const assigneeIds = assignedRequests
    .map((item) => item.assigneeId)
    .filter((id): id is string => Boolean(id));

  const assignees = await prisma.user.findMany({
    where: {
      id: {
        in: assigneeIds,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  const workload = assignedRequests.map((item) => {
    const assignee = assignees.find(
      (user) => user.id === item.assigneeId
    );

    return {
      assigneeId: item.assigneeId,
      assigneeName: assignee?.name ?? "Unknown user",
      assigneeEmail: assignee?.email ?? "",
      role: assignee?.role ?? null,
      activeRequests: item._count._all,
    };
  });

  return {
    totals: {
      totalRequests,
      openRequests,
      resolvedRequests,
      highPriorityRequests,
      averageResolutionHours:
        Math.round(averageResolutionHours * 10) / 10,
    },

    byStatus: requestsByStatus.map((item) => ({
      status: item.status,
      count: item._count._all,
    })),

    byPriority: requestsByPriority.map((item) => ({
      priority: item.priority,
      count: item._count._all,
    })),

    byCategory: requestsByCategory.map((item) => ({
      category: item.category,
      count: item._count._all,
    })),

    workload,
  };
}