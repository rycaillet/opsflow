import type { ReactNode } from "react";

import ThemeToggle from "../ui/ThemeToggle";

type PublicLayoutProps = {
  children: ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-100 p-6 transition-colors dark:bg-slate-950">
      <div className="absolute right-6 top-6">
        <ThemeToggle showLabel />
      </div>

      {children}
    </main>
  );
}