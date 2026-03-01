import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout, getStoredAuth, hasAdminAccess, hasSuperAdminAccess } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  Wallet,
  Users,
  FolderPlus,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const getPageTitle = (path: string) => {
  const map: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/create-chit-groups": "Create Group",
    "/chit-groups": "Chit Groups",
    "/chit-groups/group-members": "Member Directory",
    "/chit-groups/add-members": "Add Members",
    "/chit-groups/map-members": "Map Members",
    "/chit-groups/auctions": "Auction",
    "/my-chit": "My Chit",
    "/users": "Manage Admins",
    "/profile": "Profile",
  };
  for (const [key, title] of Object.entries(map)) {
    if (path.startsWith(key)) return title;
  }
  return "Overview";
};

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { name } = getStoredAuth();
  const isAdmin = hasAdminAccess();
  const isSuperAdmin = hasSuperAdminAccess();

  // Flow-wise order: 1.Dashboard 2.Create 3.Groups 4.Members 5.Profile
  const adminFlow = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", step: 1 },
    { name: "Create Group", icon: FolderPlus, path: "/create-chit-groups", step: 2 },
    { name: "Chit Groups", icon: Wallet, path: "/chit-groups", step: 3 },
    { name: "Member Directory", icon: Users, path: "/chit-groups/group-members", step: 4 },
  ];

  const superAdminFlow = [
    { name: "Manage Admins", icon: Shield, path: "/users", step: 1 },
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", step: 2 },
  ];

  const memberFlow = [
    { name: "My Chit", icon: Wallet, path: "/my-chit", step: 1 },
  ];

  const menuItems = [
    ...(isSuperAdmin ? superAdminFlow : []),
    ...(isAdmin && !isSuperAdmin ? adminFlow : []),
    ...(!isAdmin ? memberFlow : []),
    { name: "Profile", icon: User, path: "/profile", step: 99 },
  ];

  const isActive = (path: string) => {
    if (path === "/chit-groups") return location.pathname === "/chit-groups";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc]">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-white border-r border-slate-200/90 transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0",
          "shadow-[4px_0_24px_-4px_rgba(0,0,0,0.04)] lg:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-[72px] shrink-0 items-center gap-3 px-5 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-lg shadow-md shadow-teal-500/20">
            எ
          </div>
          <div>
            <span className="text-base font-semibold text-slate-900">Ela Chittu</span>
            <p className="text-[10px] text-slate-500 font-medium">ஏலச் சீட்டு</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "Member"}
          </p>
          {menuItems.map((item) => (
            <button
              key={item.path + item.name}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                isActive(item.path)
                  ? "bg-teal-50 text-teal-700 font-medium ring-1 ring-teal-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive(item.path) ? "text-teal-600" : "text-slate-500")} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50/80 rounded-lg text-sm"
            onClick={() => {
              logout();
              navigate("/auth");
            }}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-lg h-9 w-9"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </Button>
          <h1 className="text-sm font-semibold text-slate-800 truncate">
            {getPageTitle(location.pathname)}
          </h1>
          <div className="flex items-center gap-3 min-w-0">
            <span className="hidden text-sm text-slate-600 truncate lg:block max-w-[140px]">{name || "User"}</span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
              {(name || "U")[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
          <div className="mx-auto max-w-6xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
