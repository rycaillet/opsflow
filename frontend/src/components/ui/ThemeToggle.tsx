import { Moon, Sun } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

type ThemeToggleProps = {
  showLabel?: boolean;
  className?: string;
};

export default function ThemeToggle({
  showLabel = false,
  className = "",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const isDarkMode = theme === "dark";
  const label = isDarkMode ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950 ${className}`}
    >
      {isDarkMode ? (
        <Sun aria-hidden="true" className="h-4 w-4" />
      ) : (
        <Moon aria-hidden="true" className="h-4 w-4" />
      )}

      {showLabel && (
        <span>{isDarkMode ? "Light mode" : "Dark mode"}</span>
      )}
    </button>
  );
}