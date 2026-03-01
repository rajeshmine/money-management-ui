import { Navigate } from "react-router-dom";
import { hasAdminAccess, hasSuperAdminAccess } from "@/lib/auth";

type RoleGuardProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
};

export default function RoleGuard({
  children,
  requireAdmin = false,
  requireSuperAdmin = false,
}: RoleGuardProps) {
  if (requireSuperAdmin && !hasSuperAdminAccess()) {
    return <Navigate to="/dashboard" replace />;
  }
  if (requireAdmin && !hasAdminAccess()) {
    return <Navigate to="/my-chit" replace />;
  }
  return <>{children}</>;
}
