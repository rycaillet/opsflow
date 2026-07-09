import { useEffect, useState } from "react";
import { Calendar, Folder } from "lucide-react";
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
  const classes = {
    OPEN: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-purple-100 text-purple-700",
    WAITING: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-slate-100 text-slate-700",
  };

  return classes[status];
}

function priorityClass(priority: OpsRequest["priority"]) {
  const classes = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  };

  return classes[priority];
}

export function MyRequestsPage() {
  const [requests, setRequests] = useState<OpsRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      const token = localStorage.getItem("opsflow_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      const data = await apiRequest<OpsRequest[]>("/requests/mine", { token });
      setRequests(data);
      setIsLoading(false);
    }

    loadRequests();
  }, []);

  if (isLoading) {
    return <p className="text-slate-600">Loading requests...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Requests</h1>
        <p className="mt-2 text-slate-600">
          View and track the requests you have submitted.
        </p>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="transition hover:shadow-md">
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
        ))}
      </div>
    </div>
  );
}