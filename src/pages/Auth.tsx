import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, hasAdminAccess, hasSuperAdminAccess } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const target = hasSuperAdminAccess() ? "/users" : hasAdminAccess() ? "/dashboard" : "/my-chit";
      navigate(target, { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post<{
        token: string;
        role: string;
        name: string;
        phone: string;
        id: string;
        companyName?: string;
      }>("/api/auth/login", { phone, password });

      if (data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        localStorage.setItem("companyName", data.companyName ?? "");
        localStorage.setItem("id", data.id);
        localStorage.setItem("phone", data.phone);

        if (data.role === "SUPER_ADMIN") navigate("/users");
        else if (data.role === "ADMIN") navigate("/dashboard");
        else navigate("/my-chit");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-100/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-emerald-100/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-teal-50/50 blur-2xl" />
      </div>

      <div className="relative w-full max-w-[400px]">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
          <div className="px-8 pt-10 pb-8 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-2xl font-bold text-white shadow-lg shadow-teal-500/25 mb-5">
              எ
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Ela Chittu</h1>
            <p className="text-slate-500 text-sm mt-1">ஏலச் சீட்டு — Chit Fund Management</p>
          </div>

          <form onSubmit={handleLogin} className="px-8 pb-8 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone / போன் எண்</label>
              <Input
                type="text"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password / கடவுச்சொல்</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white transition-colors"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
        <p className="text-center text-slate-400 text-xs mt-6">Secure chit fund management platform</p>
      </div>
    </div>
  );
}
