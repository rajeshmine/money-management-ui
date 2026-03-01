/**
 * Auth helpers for route protection and role checks.
 */

export type Role = "SUPER_ADMIN" | "ADMIN" | "MEMBER";

export function getStoredAuth() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") as Role | null;
  const name = localStorage.getItem("name");
  const id = localStorage.getItem("id");
  return { token, role, name, id };
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

export function hasAdminAccess(): boolean {
  const role = localStorage.getItem("role");
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function hasSuperAdminAccess(): boolean {
  return localStorage.getItem("role") === "SUPER_ADMIN";
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("companyName");
  localStorage.removeItem("id");
  localStorage.removeItem("phone");
}
