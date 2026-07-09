type PublicLayoutProps = {
  children: React.ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      {children}
    </main>
  );
}