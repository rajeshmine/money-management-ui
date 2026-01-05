import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, User, LogOut, Menu, X, Settings, Wallet, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Users", icon: LayoutDashboard, path: "/users" },
    { name: "Chit Groups", icon: Wallet, path: "/chit-groups" },
    { name: "Chit Members", icon: Wallet, path: "/chit-groups/group-members" },
  ];

  return (
    // Parent container is locked to screen height
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR - Separately Scrollable */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 shrink-0 items-center px-6 border-b">
          <span className="text-xl font-bold text-primary">MoneyApp</span>
        </div>

        {/* This div scrolls independently */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                location.pathname === item.path ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
          {/* Repeat items to test scrolling if needed */}
        </nav>

        <div className="p-4 border-t shrink-0">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500" onClick={() => navigate("/auth")}>
            <LogOut className="h-5 w-5" /> Logout
          </Button>
        </div>
      </aside>

      {/* RIGHT SIDE AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* HEADER - Sticky/Fixed at top */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-white px-8 shadow-sm">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {location.pathname.replace("/", "") || "Overview"}
          </h1>
          <div className="flex items-center gap-4">
             <span className="hidden text-sm font-medium lg:block">John Doe</span>
             <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
        </header>

        {/* MAIN CONTENT - Separately Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10">
          {/* This wrapper ensures content doesn't touch the edges */}
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}