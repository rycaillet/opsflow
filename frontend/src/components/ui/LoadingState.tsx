import { LoaderCircle } from "lucide-react";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm"
    >
      <LoaderCircle className="h-7 w-7 animate-spin text-blue-600" />

      <p className="mt-3 text-sm font-medium text-slate-600">
        {message}
      </p>
    </div>
  );
}