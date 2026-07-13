import type { OpsRequest } from "../../types/request";

type StatusBadgeProps = {
  status: OpsRequest["status"];
};

function formatStatus(status: OpsRequest["status"]) {
  return status
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

const statusClasses: Record<
  OpsRequest["status"],
  string
> = {
  OPEN: "bg-blue-100 text-blue-700 ring-blue-200",
  IN_PROGRESS:
    "bg-purple-100 text-purple-700 ring-purple-200",
  WAITING:
    "bg-amber-100 text-amber-800 ring-amber-200",
  RESOLVED:
    "bg-green-100 text-green-700 ring-green-200",
  CLOSED:
    "bg-slate-100 text-slate-700 ring-slate-200",
};

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses[status]}`}
    >
      {formatStatus(status)}
    </span>
  );
}