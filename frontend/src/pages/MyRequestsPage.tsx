import { useEffect, useMemo, useState } from "react";
import { Calendar, Folder, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { apiRequest } from "../services/api";
import type { OpsRequest } from "../types/request";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
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

function priorityClass(priority: OpsRequest["priority"]) {
  return {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  }[priority];
}

export function MyRequestsPage() {
  const [requests, setRequests] = useState<OpsRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    async function loadRequests() {
      const token = localStorage.getItem("opsflow_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      const data = await apiRequest<OpsRequest[]>("/requests/mine", {
        token,
      });

      setRequests(data);
      setIsLoading(false);
    }

    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.title.toLowerCase().includes(search.toLowerCase()) ||
        request.description.toLowerCase().includes(search.toLowerCase()) ||
        request.category.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || request.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || request.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [requests, search, statusFilter, priorityFilter]);

  if (isLoading) {
    return <p className="text-slate-600">Loading requests...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          My Requests
        </h1>

        <p className="mt-2 text-slate-600">
          View and track the requests you have submitted.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

          <input
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Search requests..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING">Waiting</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Link
            key={request.id}
            to={`/requests/${request.id}`}
            className="block"
          >
            <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {request.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {request.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Folder className="h-4 w-4" />
                      {request.category}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Opened {formatDate(request.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                      request.status
                    )}`}
                  >
                    {request.status.replace("_", " ")}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClass(
                      request.priority
                    )}`}
                  >
                    {request.priority}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {filteredRequests.length === 0 && (
          <Card>
            <p className="text-sm text-slate-600">
              No requests match your search or filters.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}