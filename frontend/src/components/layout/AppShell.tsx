import { BarChart3, Home, Inbox, PlusCircle, Settings } from "lucide-react";

type AppShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Dashboard", icon: Home },
  { label: "My Requests", icon: Inbox },
  { label: "New Request", icon: PlusCircle },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-6 md:block">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-bold text-slate-900">OpsFlow</h1>
          <p className="text-sm text-slate-500">Operations workspace</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-sm text-slate-500">BluePeak Technologies</p>
            <h2 className="text-xl font-semibold text-slate-900">
              Operations Dashboard
            </h2>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}