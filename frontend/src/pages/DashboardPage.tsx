import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Inbox,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { apiRequest } from "../services/api";
import type { OpsRequest } from "../types/request";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatStatus(status: OpsRequest["status"]) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function statusClass(status: OpsRequest["status"]) {
  return {
    OPEN: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-purple-100 text-purple-700",
    WAITING: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-slate-100 text-slate-700",
  }[status];
}

type MetricCardProps = {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
};

function MetricCard({
  label,
  value,
  icon: Icon,
}: MetricCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const { user, token } = useAuth();

  const [requests, setRequests] = useState<OpsRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isEmployee = user?.role === "EMPLOYEE";

  useEffect(() => {
    async function loadRequests() {
      if (!token || !user) {
        setError("You are not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");

        const endpoint =
          user.role === "EMPLOYEE"
            ? "/requests/mine"
            : "/requests";

        const data = await apiRequest<OpsRequest[]>(endpoint, {
          token,
        });

        setRequests(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadRequests();
  }, [token, user]);

  const metrics = useMemo(() => {
    const openRequests = requests.filter(
      (request) =>
        request.status === "OPEN" ||
        request.status === "IN_PROGRESS" ||
        request.status === "WAITING"
    ).length;

    const highPriority = requests.filter(
      (request) =>
        request.priority === "HIGH" ||
        request.priority === "URGENT"
    ).length;

    const resolvedRequests = requests.filter(
      (request) =>
        request.status === "RESOLVED" ||
        request.status === "CLOSED"
    ).length;

    const assignedToMe = requests.filter(
      (request) => request.assigneeId === user?.id
    ).length;

    return {
      total: requests.length,
      openRequests,
      highPriority,
      resolvedRequests,
      assignedToMe,
    };
  }, [requests, user?.id]);

  const recentRequests = useMemo(() => {
    return [...requests]
      .sort(
        (firstRequest, secondRequest) =>
          new Date(secondRequest.updatedAt).getTime() -
          new Date(firstRequest.updatedAt).getTime()
      )
      .slice(0, 5);
  }, [requests]);

  if (isLoading) {
    return (
      <LoadingState message="Loading dashboard..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        message={error}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          isEmployee
            ? "My Dashboard"
            : user?.role === "STAFF"
              ? "Staff Dashboard"
              : "Operations Dashboard"
        }
        description={
          isEmployee
            ? "Track the requests you have submitted and their progress."
            : user?.role === "STAFF"
              ? "Monitor incoming requests, priorities, and your assigned work."
              : "Review operational request volume and current workload."
        }
      />

      <div
        className={`grid gap-4 ${
          isEmployee
            ? "md:grid-cols-3"
            : "md:grid-cols-2 xl:grid-cols-4"
        }`}
      >
        {isEmployee ? (
          <>
            <MetricCard
              label="My Requests"
              value={metrics.total}
              icon={Inbox}
            />

            <MetricCard
              label="Open Requests"
              value={metrics.openRequests}
              icon={Clock3}
            />

            <MetricCard
              label="Resolved Requests"
              value={metrics.resolvedRequests}
              icon={CheckCircle2}
            />
          </>
        ) : (
          <>
            <MetricCard
              label="Open Requests"
              value={metrics.openRequests}
              icon={Clock3}
            />

            <MetricCard
              label="Assigned to Me"
              value={metrics.assignedToMe}
              icon={UserCheck}
            />

            <MetricCard
              label="High Priority"
              value={metrics.highPriority}
              icon={AlertTriangle}
            />

            <MetricCard
              label="Resolved Requests"
              value={metrics.resolvedRequests}
              icon={CheckCircle2}
            />
          </>
        )}
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEmployee
                ? "Recent Requests"
                : "Recently Updated Requests"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEmployee
                ? "Your latest submitted requests."
                : "The most recently updated items in the request queue."}
            </p>
          </div>

          <Link
            to="/requests"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {isEmployee
              ? "View all requests"
              : "Open request queue"}
          </Link>
        </div>

        <div className="mt-5 divide-y divide-slate-200">
          {recentRequests.map((request) => (
            <Link
              key={request.id}
              to={`/requests/${request.id}`}
              className="flex flex-col gap-3 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-2"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900">
                  {request.title}
                </p>

                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
                  <span>{request.category}</span>
                  <span>
                    Updated {formatDate(request.updatedAt)}
                  </span>

                  {!isEmployee && request.requester && (
                    <span>
                      Requested by {request.requester.name}
                    </span>
                  )}
                </div>
              </div>

              <span
                className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                  request.status
                )}`}
              >
                {formatStatus(request.status)}
              </span>
            </Link>
          ))}

          {recentRequests.length === 0 && (
            <div className="py-4">
              <EmptyState
                title="No requests yet"
                message={
                  isEmployee
                    ? "Create your first request to begin tracking its progress."
                    : "New workplace requests will appear here when they are submitted."
                }
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}