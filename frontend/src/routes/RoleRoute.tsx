import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";

type RoleRouteProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
};

export function RoleRoute({
  children,
  allowedRoles,
}: RoleRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-600">
          Loading workspace...
        </p>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}