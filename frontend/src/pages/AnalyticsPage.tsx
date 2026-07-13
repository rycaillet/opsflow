import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  Inbox,
  Users,
} from "lucide-react";

import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { apiRequest } from "../services/api";
import type {
  AnalyticsSummary,
  CategoryAnalyticsItem,
  PriorityAnalyticsItem,
  StatusAnalyticsItem,
} from "../types/analytics";

type MetricCardProps = {
  label: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: MetricCardProps) {
  return (
    <Card className="h-full">
      <div className="flex h-full items-start justify-between gap-4">
        <div>
          <p className="min-h-10 text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

type BreakdownItem = {
  label: string;
  count: number;
};

type BreakdownCardProps = {
  title: string;
  description: string;
  items: BreakdownItem[];
  emptyMessage: string;
};

function BreakdownCard({
  title,
  description,
  items,
  emptyMessage,
}: BreakdownCardProps) {
  const maximumCount = Math.max(
    ...items.map((item) => item.count),
    1,
  );

  return (
    <Card>
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {items.map((item) => {
          const percentage =
            (item.count / maximumCount) * 100;

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.label}
                </p>

                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.count}
                </p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <EmptyState
            title="No data available"
            message={emptyMessage}
          />
        )}
      </div>
    </Card>
  );
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function formatResolutionTime(hours: number) {
  if (hours === 0) {
    return "0 hrs";
  }

  if (hours < 24) {
    return `${hours.toFixed(1)} hrs`;
  }

  return `${(hours / 24).toFixed(1)} days`;
}

export function AnalyticsPage() {
  const { token } = useAuth();

  const [summary, setSummary] =
    useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      if (!token) {
        setError("You are not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");

        const data = await apiRequest<AnalyticsSummary>(
          "/analytics/summary",
          {
            token,
          },
        );

        setSummary(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load analytics.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, [token]);

  const statusItems = useMemo(() => {
    if (!summary) {
      return [];
    }

    return summary.byStatus.map(
      (item: StatusAnalyticsItem) => ({
        label: formatLabel(item.status),
        count: item.count,
      }),
    );
  }, [summary]);

  const priorityItems = useMemo(() => {
    if (!summary) {
      return [];
    }

    return summary.byPriority.map(
      (item: PriorityAnalyticsItem) => ({
        label: formatLabel(item.priority),
        count: item.count,
      }),
    );
  }, [summary]);

  const categoryItems = useMemo(() => {
    if (!summary) {
      return [];
    }

    return summary.byCategory.map(
      (item: CategoryAnalyticsItem) => ({
        label: item.category,
        count: item.count,
      }),
    );
  }, [summary]);

  if (isLoading) {
    return <LoadingState message="Loading analytics..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load analytics"
        message={error}
      />
    );
  }

  if (!summary) {
    return (
      <EmptyState
        title="No analytics available"
        message="Analytics data has not been generated yet."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Monitor request volume, resolution performance, and team workload."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Total Requests"
          value={summary.totals.totalRequests}
          description="All submitted requests"
          icon={Inbox}
        />

        <MetricCard
          label="Active Requests"
          value={summary.totals.openRequests}
          description="Open, in progress, or waiting"
          icon={Clock3}
        />

        <MetricCard
          label="Resolved"
          value={summary.totals.resolvedRequests}
          description="Resolved or closed requests"
          icon={CheckCircle2}
        />

        <MetricCard
          label="High Priority"
          value={summary.totals.highPriorityRequests}
          description="High and urgent requests"
          icon={AlertTriangle}
        />

        <MetricCard
          label="Avg. Resolution"
          value={formatResolutionTime(
            summary.totals.averageResolutionHours,
          )}
          description="Average completion time"
          icon={BarChart3}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <BreakdownCard
          title="Requests by Status"
          description="Current workflow distribution."
          items={statusItems}
          emptyMessage="No status data is available."
        />

        <BreakdownCard
          title="Requests by Priority"
          description="Priority distribution across all requests."
          items={priorityItems}
          emptyMessage="No priority data is available."
        />

        <BreakdownCard
          title="Requests by Category"
          description="Request volume across operational areas."
          items={categoryItems}
          emptyMessage="No category data is available."
        />
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Users className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Active Team Workload
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Active requests currently assigned to team members.
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          {summary.workload.length > 0 ? (
            <>
              <div className="grid grid-cols-[1fr_auto] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300 sm:grid-cols-[1fr_1fr_auto]">
                <span>Team member</span>

                <span className="hidden sm:block">
                  Email
                </span>

                <span>Active requests</span>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {summary.workload.map((item) => (
                  <div
                    key={item.assigneeId}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 sm:grid-cols-[1fr_1fr_auto]"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {item.assigneeName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                        {item.assigneeEmail}
                      </p>
                    </div>

                    <p className="hidden truncate text-sm text-slate-500 dark:text-slate-400 sm:block">
                      {item.assigneeEmail}
                    </p>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {item.activeRequests}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-4">
              <EmptyState
                title="No assigned workload"
                message="No active requests are currently assigned to a team member."
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}