import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { apiRequest } from "../services/api";
import type { OpsRequest } from "../types/request";

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
          <Card key={request.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {request.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {request.description}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  {request.category}
                </p>
              </div>

              <div className="text-right">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {request.status}
                </span>
                <p className="mt-3 text-sm font-medium text-slate-700">
                  {request.priority}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}