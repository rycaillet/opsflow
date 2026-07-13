import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
  error?: string;
};

export function PasswordInput({
  label,
  error,
  className = "",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-950 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100 dark:border-red-500 dark:focus:ring-red-950"
              : ""
          } ${className}`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          disabled={props.disabled}
          className="absolute inset-y-0 right-0 inline-flex items-center gap-1.5 px-3 text-sm font-medium text-slate-500 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-400 dark:hover:text-slate-200"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}

          {isVisible ? "Hide" : "Show"}
        </button>
      </div>

      {error && (
        <span className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}