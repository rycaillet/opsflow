import { useEffect, useState } from "react";
import { Calendar, Folder, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { apiRequest } from "../services/api";
import type { Comment } from "../types/comment";
import type { OpsRequest } from "../types/request";

const statuses: OpsRequest["status"][] = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING",
  "RESOLVED",
  "CLOSED",
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function RequestDetailPage() {
  const { id } = useParams();

  const [request, setRequest] = useState<OpsRequest | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("opsflow_token");

        if (!token || !id) {
          setError("Unable to load request.");
          return;
        }

        const requestData = await apiRequest<OpsRequest>(`/requests/${id}`, {
          token,
        });

        const commentData = await apiRequest<Comment[]>(
          `/requests/${id}/comments`,
          { token }
        );

        setRequest(requestData);
        setComments(commentData);
      } catch {
        setError("Request not found.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleStatusChange(newStatus: OpsRequest["status"]) {
    if (!request) return;

    try {
      setIsUpdating(true);

      const token = localStorage.getItem("opsflow_token");

      if (!token) {
        setError("You must be logged in.");
        return;
      }

      const updatedRequest = await apiRequest<OpsRequest>(
        `/requests/${request.id}/status`,
        {
          method: "PATCH",
          token,
          body: JSON.stringify({ status: newStatus }),
        }
      );

      setRequest(updatedRequest);
    } catch {
      setError("Unable to update request status.");
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return <p className="text-slate-600">Loading request...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!request) {
    return null;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        to="/requests"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to requests
      </Link>

      <Card>
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {request.title}
            </h1>

            <p className="mt-2 text-slate-600">{request.description}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Folder className="h-4 w-4" />
              {request.category}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Opened {formatDate(request.createdAt)}
            </span>
          </div>

          <div className="grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-500">
                Status
              </span>

              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                value={request.status}
                onChange={(event) =>
                  handleStatusChange(event.target.value as OpsRequest["status"])
                }
                disabled={isUpdating}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>

              {isUpdating && (
                <p className="text-xs text-slate-500">Updating status...</p>
              )}
            </label>

            <div>
              <p className="text-sm font-medium text-slate-500">Priority</p>
              <p className="mt-1 font-semibold text-slate-900">
                {request.priority}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Timeline</h2>

        <div className="mt-4 space-y-4">
          <div className="flex gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
            <div>
              <p className="font-medium text-slate-900">Request created</p>
              <p className="text-sm text-slate-500">
                {formatDateTime(request.createdAt)}
              </p>
            </div>
          </div>

          {request.updatedAt !== request.createdAt && (
            <div className="flex gap-3">
              <div className="mt-1 h-3 w-3 rounded-full bg-purple-600" />
              <div>
                <p className="font-medium text-slate-900">
                  Status updated to {request.status.replace("_", " ")}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDateTime(request.updatedAt)}
                </p>
              </div>
            </div>
          )}

          {request.resolvedAt && (
            <div className="flex gap-3">
              <div className="mt-1 h-3 w-3 rounded-full bg-green-600" />
              <div>
                <p className="font-medium text-slate-900">Request resolved</p>
                <p className="text-sm text-slate-500">
                  {formatDateTime(request.resolvedAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-slate-500" />
          <h2 className="text-lg font-semibold text-slate-900">Comments</h2>
        </div>

        <div className="mt-4 space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">
                    {comment.author.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {comment.author.role}
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  {formatDateTime(comment.createdAt)}
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                {comment.body}
              </p>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-sm text-slate-600">
              No comments have been added yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}