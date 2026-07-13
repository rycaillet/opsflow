import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}