import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { apiRequest } from "../services/api";
import type { OpsRequest } from "../types/request";

export function DashboardPage() {
  const [requests, setRequests] = useState<OpsRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        const token = localStorage.getItem("opsflow_token");

        if (!token) {
          setError("You are not logged in.");
          return;
        }

        const data = await apiRequest<OpsRequest[]>("/requests/mine", {
          token,
        });

        setRequests(data);
      } catch {
        setError("Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadRequests();
  }, []);

  const openRequests = requests.filter((request) => request.status === "OPEN").length;
  const highPriority = requests.filter((request) => request.priority === "HIGH" || request.priority === "URGENT").length;
  const resolvedThisWeek = requests.filter((request) => request.status === "RESOLVED").length;

  if (isLoading) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Track internal requests, priorities, and team workload.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Open Requests</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{openRequests}</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">High Priority</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{highPriority}</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Resolved This Week</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{resolvedThisWeek}</p>
        </Card>
      </div>
    </div>
  );
}