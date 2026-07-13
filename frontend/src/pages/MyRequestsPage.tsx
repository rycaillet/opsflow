import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Folder,
  Search,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { PriorityBadge } from "../components/ui/PriorityBadge";
import { StatusBadge } from "../components/ui/StatusBadge";
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

export function MyRequestsPage() {
  const { user, token } = useAuth();

  const [requests, setRequests] = useState<OpsRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const isEmployee = user?.role === "EMPLOYEE";

  useEffect(() => {
    async function loadRequests() {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setError("");

        const endpoint =
          user.role === "EMPLOYEE"
            ? "/requests/mine"
            : "/requests";

        const data = await apiRequest<OpsRequest[]>(
          endpoint,
          {
            token,
          },
        );

        setRequests(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load requests.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadRequests();
  }, [token, user]);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return requests.filter((request) => {
      const searchableText = [
        request.title,
        request.description,
        request.category,
        request.requester?.name ?? "",
        request.requester?.email ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        request.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        request.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    requests,
    search,
    statusFilter,
    priorityFilter,
  ]);

  if (isLoading) {
    return <LoadingState message="Loading requests..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load requests"
        message={error}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEmployee ? "My Requests" : "Request Queue"}
        description={
          isEmployee
            ? "View and track the requests you have submitted."
            : "Review and manage incoming workplace requests."
        }
      />

      <Card className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

          <input
            type="search"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-950"
            placeholder={
              isEmployee
                ? "Search your requests..."
                : "Search requests or employees..."
            }
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-950"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="ALL">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">
              In Progress
            </option>
            <option value="WAITING">Waiting</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-950"
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value)
            }
          >
            <option value="ALL">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </Card>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing {filteredRequests.length} of{" "}
        {requests.length} requests
      </p>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Link
            key={request.id}
            to={`/requests/${request.id}`}
            className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:hover:border-slate-700 dark:hover:bg-slate-800/80">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {request.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {request.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Folder className="h-4 w-4" />
                      {request.category}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Opened {formatDate(request.createdAt)}
                    </span>

                    {!isEmployee && request.requester && (
                      <span className="inline-flex items-center gap-1.5">
                        <UserRound className="h-4 w-4" />
                        {request.requester.name}
                      </span>
                    )}
                  </div>

                  {!isEmployee && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {request.assignee
                        ? `Assigned to ${request.assignee.name}`
                        : "Unassigned"}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-row gap-3 sm:flex-col sm:items-end">
                  <StatusBadge status={request.status} />
                  <PriorityBadge priority={request.priority} />
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {filteredRequests.length === 0 && (
          <EmptyState
            title={
              requests.length === 0
                ? isEmployee
                  ? "No requests submitted"
                  : "The request queue is empty"
                : "No matching requests"
            }
            message={
              requests.length === 0
                ? isEmployee
                  ? "Your submitted workplace requests will appear here."
                  : "New requests will appear here when employees submit them."
                : "Try changing your search text or clearing one of the filters."
            }
          />
        )}
      </div>
    </div>
  );
}