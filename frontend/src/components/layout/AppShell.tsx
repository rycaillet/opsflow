import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Home,
  Inbox,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type AppShellProps = {
  children: React.ReactNode;
};

const employeeNavItems = [
  { label: "Dashboard", to: "/", icon: Home, end: true },
  {
    label: "My Requests",
    to: "/requests",
    icon: Inbox,
    end: true,
  },
  {
    label: "New Request",
    to: "/requests/new",
    icon: PlusCircle,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

const staffNavItems = [
  { label: "Dashboard", to: "/", icon: Home, end: true },
  {
    label: "Request Queue",
    to: "/requests",
    icon: Inbox,
    end: true,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

const managerNavItems = [
  { label: "Dashboard", to: "/", icon: Home, end: true },
  {
    label: "Request Queue",
    to: "/requests",
    icon: Inbox,
    end: true,
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

function navClass(isActive: boolean) {
  return `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-blue-600 text-white shadow"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

function formatRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems =
    user?.role === "EMPLOYEE"
      ? employeeNavItems
      : user?.role === "STAFF"
        ? staffNavItems
        : managerNavItems;

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

  function handleLogout() {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white md:flex md:flex-col">
        <div className="border-b border-slate-200 px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">OpsFlow</h1>

          <p className="mt-1 text-sm text-slate-500">
            Operations Workspace
          </p>
        </div>

        <nav className="flex-1 p-4">
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

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <UserRound size={18} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {user?.name}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user?.email}
                </p>

                {user?.role && (
                  <p className="mt-1 text-xs font-medium text-blue-700">
                    {formatRole(user.role)}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="md:ml-64">
        <header className="relative border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-6 py-5 md:px-8">
            <div>
              <p className="text-sm text-slate-500">
                BluePeak Technologies
              </p>

              <h2 className="text-2xl font-semibold text-slate-900">
                Operations Dashboard
              </h2>
            </div>

            <div ref={mobileMenuRef} className="relative md:hidden">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                onClick={() =>
                  setIsMobileMenuOpen((isOpen) => !isOpen)
                }
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                Menu
              </button>

              {isMobileMenuOpen && (
                <nav className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <div className="mb-2 border-b border-slate-200 px-3 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {user?.email}
                    </p>

                    {user?.role && (
                      <p className="mt-1 text-xs font-medium text-blue-700">
                        {formatRole(user.role)}
                      </p>
                    )}
                  </div>

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

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
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