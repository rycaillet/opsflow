import { Card } from "../components/ui/Card";

export function DashboardPage() {
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
          <p className="mt-2 text-3xl font-bold text-slate-900">12</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">High Priority</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">4</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Resolved This Week</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">18</p>
        </Card>
      </div>
    </div>
  );
}