export type AnalyticsBreakdownItem = {
  count: number;
};

export type StatusAnalyticsItem = AnalyticsBreakdownItem & {
  status: "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED";
};

export type PriorityAnalyticsItem = AnalyticsBreakdownItem & {
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
};

export type CategoryAnalyticsItem = AnalyticsBreakdownItem & {
  category: string;
};

export type WorkloadAnalyticsItem = {
  assigneeId: string;
  assigneeName: string;
  assigneeEmail: string;
  role: "STAFF" | "MANAGER" | "ADMIN" | null;
  activeRequests: number;
};

export type AnalyticsSummary = {
  totals: {
    totalRequests: number;
    openRequests: number;
    resolvedRequests: number;
    highPriorityRequests: number;
    averageResolutionHours: number;
  };
  byStatus: StatusAnalyticsItem[];
  byPriority: PriorityAnalyticsItem[];
  byCategory: CategoryAnalyticsItem[];
  workload: WorkloadAnalyticsItem[];
};