import { useEffect, useState, type FormEvent } from "react";
import {
  Calendar,
  Folder,
  MessageSquare,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PriorityBadge } from "../components/ui/PriorityBadge";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { apiRequest } from "../services/api";
import type { Comment } from "../types/comment";
import type { OpsRequest } from "../types/request";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";

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

function formatStatus(status: OpsRequest["status"]) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function RequestDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [request, setRequest] = useState<OpsRequest | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [error, setError] = useState("");

  const canManageRequest =
    user?.role === "STAFF" ||
    user?.role === "MANAGER" ||
    user?.role === "ADMIN";

  const isAssignedToCurrentUser =
    request?.assigneeId === user?.id;

  useEffect(() => {
    async function loadData() {
      if (!token || !id) {
        setError("Unable to load request.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");

        const requestData = await apiRequest<OpsRequest>(
          `/requests/${id}`,
          {
            token,
          }
        );

        const commentData = await apiRequest<Comment[]>(
          `/requests/${id}/comments`,
          {
            token,
          }
        );

        setRequest(requestData);
        setComments(commentData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Request not found."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id, token]);

  async function handleStatusChange(
    newStatus: OpsRequest["status"]
  ) {
    if (!request || !token || !canManageRequest) {
      return;
    }

    try {
      setIsUpdating(true);
      setError("");

      const updatedRequest = await apiRequest<OpsRequest>(
        `/requests/${request.id}/status`,
        {
          method: "PATCH",
          token,
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      setRequest((currentRequest) =>
        currentRequest
          ? {
              ...currentRequest,
              ...updatedRequest,
            }
          : updatedRequest
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update request status."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleAssignToSelf() {
    if (!request || !token || !canManageRequest) {
      return;
    }

    try {
      setIsAssigning(true);
      setError("");

      const updatedRequest = await apiRequest<OpsRequest>(
        `/requests/${request.id}/assign-self`,
        {
          method: "PATCH",
          token,
        }
      );

      setRequest(updatedRequest);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to assign request."
      );
    } finally {
      setIsAssigning(false);
    }
  }

  async function handleAddComment(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedComment = newComment.trim();

    if (!request || !token || !trimmedComment) {
      return;
    }

    try {
      setIsPostingComment(true);
      setError("");

      const createdComment = await apiRequest<Comment>(
        `/requests/${request.id}/comments`,
        {
          method: "POST",
          token,
          body: JSON.stringify({
            body: trimmedComment,
          }),
        }
      );

      setComments((currentComments) => [
        ...currentComments,
        createdComment,
      ]);

      setNewComment("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to add comment."
      );
    } finally {
      setIsPostingComment(false);
    }
  }

  if (isLoading) {
    return (
      <LoadingState message="Loading request details..." />
    );
  }

  if (error && !request) {
    return (
      <ErrorState
        title="Unable to load request"
        message={error}
      />
    );
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

      {error && (
        <Card>
          <p
            role="alert"
            className="text-sm font-medium text-red-600"
          >
            {error}
          </p>
        </Card>
      )}

      <Card>
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {request.title}
            </h1>

            <p className="mt-2 leading-7 text-slate-600">
              {request.description}
            </p>
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

          {canManageRequest && request.requester && (
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <UserRound className="h-4 w-4 shrink-0" />

                  <span>
                    Requested by{" "}
                    <span className="font-medium text-slate-900">
                      {request.requester.name}
                    </span>
                  </span>
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <p className="text-sm text-slate-600">
                    {isAssignedToCurrentUser
                      ? "Assigned to you"
                      : request.assignee
                        ? `Assigned to ${request.assignee.name}`
                        : "Currently unassigned"}
                  </p>

                  {!request.assignee && (
                    <Button
                      type="button"
                      onClick={handleAssignToSelf}
                      disabled={isAssigning}
                    >
                      {isAssigning
                        ? "Assigning..."
                        : "Assign to Me"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">
                Status
              </p>

              {canManageRequest ? (
                <>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    value={request.status}
                    onChange={(event) =>
                      handleStatusChange(
                        event.target.value as OpsRequest["status"]
                      )
                    }
                    disabled={isUpdating}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>

                  {isUpdating && (
                    <p className="text-xs text-slate-500">
                      Updating status...
                    </p>
                  )}
                </>
              ) : (
                <StatusBadge status={request.status} />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">
                Priority
              </p>

              <PriorityBadge priority={request.priority} />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">
          Timeline
        </h2>

        <div className="mt-4 space-y-4">
          <div className="flex gap-3">
            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600" />

            <div>
              <p className="font-medium text-slate-900">
                Request created
              </p>

              <p className="text-sm text-slate-500">
                {formatDateTime(request.createdAt)}
              </p>
            </div>
          </div>

          {request.updatedAt !== request.createdAt && (
            <div className="flex gap-3">
              <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-purple-600" />

              <div>
                <p className="font-medium text-slate-900">
                  Status updated to {formatStatus(request.status)}
                </p>

                <p className="text-sm text-slate-500">
                  {formatDateTime(request.updatedAt)}
                </p>
              </div>
            </div>
          )}

          {request.resolvedAt && (
            <div className="flex gap-3">
              <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-green-600" />

              <div>
                <p className="font-medium text-slate-900">
                  Request resolved
                </p>

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

          <h2 className="text-lg font-semibold text-slate-900">
            Comments
          </h2>
        </div>

        <div className="mt-4 space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    {comment.author.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {formatRole(comment.author.role)}
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  {formatDateTime(comment.createdAt)}
                </p>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
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

        <form
          onSubmit={handleAddComment}
          className="mt-6 space-y-3"
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Add comment
            </span>

            <textarea
              className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              value={newComment}
              onChange={(event) =>
                setNewComment(event.target.value)
              }
              placeholder="Add an update or note about this request..."
              disabled={isPostingComment}
            />
          </label>

          <Button
            type="submit"
            disabled={
              isPostingComment || !newComment.trim()
            }
          >
            {isPostingComment
              ? "Posting..."
              : "Post Comment"}
          </Button>
        </form>
      </Card>
    </div>
  );
}