import { AlertCircle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message: string;
};

export function ErrorState({
  title = "Something went wrong",
  message,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-6 py-5"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

        <div>
          <p className="font-semibold text-red-900">
            {title}
          </p>

          <p className="mt-1 text-sm text-red-700">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}