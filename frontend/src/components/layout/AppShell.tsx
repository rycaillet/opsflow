import {
  BarChart3,
  Home,
  Inbox,
  PlusCircle,
  Settings,
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

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white md:block">
        <div className="border-b border-slate-200 px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">
            OpsFlow
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Operations Workspace
          </p>
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
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-blue-600 text-white shadow"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
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
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <p className="text-sm text-slate-500">
            BluePeak Technologies
          </p>

          <h2 className="text-2xl font-semibold text-slate-900">
            Operations Dashboard
          </h2>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}