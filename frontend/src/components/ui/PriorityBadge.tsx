import type { OpsRequest } from "../../types/request";

type PriorityBadgeProps = {
  priority: OpsRequest["priority"];
};

const priorityClasses: Record<
  OpsRequest["priority"],
  string
> = {
  LOW: "bg-slate-100 text-slate-700 ring-slate-200",
  MEDIUM:
    "bg-amber-100 text-amber-800 ring-amber-200",
  HIGH:
    "bg-orange-100 text-orange-700 ring-orange-200",
  URGENT: "bg-red-100 text-red-700 ring-red-200",
};

export function PriorityBadge({
  priority,
}: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${priorityClasses[priority]}`}
    >
      {priority}
    </span>
  );
}