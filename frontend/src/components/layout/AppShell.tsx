import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Home,
  Inbox,
  Menu,
  PlusCircle,
  Settings,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

type AppShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Dashboard", to: "/", icon: Home, end: true },
  { label: "My Requests", to: "/requests", icon: Inbox, end: true },
  { label: "New Request", to: "/requests/new", icon: PlusCircle },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
];

function navClass(isActive: boolean) {
  return `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-blue-600 text-white shadow"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white md:block">
        <div className="border-b border-slate-200 px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">OpsFlow</h1>
          <p className="mt-1 text-sm text-slate-500">Operations Workspace</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => navClass(isActive)}
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="md:ml-64">
        <header className="relative border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-6 py-5 md:px-8">
            <div>
              <p className="text-sm text-slate-500">BluePeak Technologies</p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Operations Dashboard
              </h2>
            </div>

            <div ref={mobileMenuRef} className="relative md:hidden">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                Menu
              </button>

              {isMobileMenuOpen && (
                <nav className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.label}
                        to={item.to}
                        end={item.end}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                            isActive
                              ? "bg-blue-600 text-white"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`
                        }
                      >
                        <Icon size={16} />
                        {item.label}
                      </NavLink>
                    );
                  })}
                </nav>
              )}
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}