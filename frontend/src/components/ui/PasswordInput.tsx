import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
  };

export function PasswordInput({
  label,
  className = "",
  disabled,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>

      <div className="relative">
        <input
          {...props}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          className={`w-full rounded-lg border border-slate-300 px-3 py-2 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        />

        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          disabled={disabled}
          aria-label={
            isVisible ? `Hide ${label}` : `Show ${label}`
          }
          aria-pressed={isVisible}
          className="absolute inset-y-0 right-0 flex items-center gap-1.5 px-3 text-xs font-medium text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}

          {isVisible ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}