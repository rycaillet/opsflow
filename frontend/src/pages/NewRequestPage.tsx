import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { apiRequest } from "../services/api";
import type { OpsRequest } from "../types/request";
import { PageHeader } from "../components/ui/PageHeader";

export function NewRequestPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("IT Support");
  const [priority, setPriority] = useState<OpsRequest["priority"]>("MEDIUM");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const token = localStorage.getItem("opsflow_token");

      if (!token) {
        setError("You must be logged in.");
        return;
      }

      await apiRequest<OpsRequest>("/requests", {
        method: "POST",
        token,
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
        }),
      });

      navigate("/requests");
    } catch {
      setError("Unable to create request.");
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="New Request"
        description="Submit a workplace request for IT, facilities, HR, or equipment support."
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Description
            </span>
            <textarea
              className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>IT Support</option>
              <option>Facilities</option>
              <option>HR</option>
              <option>Equipment</option>
              <option>Access Request</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Priority</span>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as OpsRequest["priority"])
              }
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </label>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <Button type="submit">Create Request</Button>
        </form>
      </Card>
    </div>
  );
}