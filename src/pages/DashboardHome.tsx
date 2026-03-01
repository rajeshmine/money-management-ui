import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Users, ArrowRight, FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { getStoredAuth } from "@/lib/auth";

export default function DashboardHome() {
  const navigate = useNavigate();
  const { name } = getStoredAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ groups: 0, members: 0, recentGroups: [] as any[] });

  useEffect(() => {
    const fetchStats = async () => {
      const adminId = localStorage.getItem("id");
      const role = localStorage.getItem("role");
      try {
        const groups = await api.get<any[]>(`/api/groups/my-groups?adminId=${adminId || ""}&role=${role || ""}`);
        const members = role === "SUPER_ADMIN" || !adminId ? [] : await api.get<any[]>(`/api/admin/all-members/${adminId}`);
        setStats({
          groups: groups?.length ?? 0,
          members: members?.length ?? 0,
          recentGroups: (groups ?? []).slice(0, 5),
        });
      } catch {
        setStats({ groups: 0, members: 0, recentGroups: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Welcome back, {name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200/80 bg-white rounded-xl overflow-hidden hover:border-slate-300/80 transition-all duration-200 card-elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Groups</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {loading ? (
              <div className="h-9 w-16 skeleton rounded" />
            ) : (
              <div className="text-2xl font-semibold text-slate-900">{stats.groups}</div>
            )}
            <p className="text-xs text-slate-500 mt-1">Chit groups created</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 bg-white rounded-xl overflow-hidden hover:border-slate-300/80 transition-all duration-200 card-elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Members</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {loading ? (
              <div className="h-9 w-16 skeleton rounded" />
            ) : (
              <div className="text-2xl font-semibold text-slate-900">{stats.members}</div>
            )}
            <p className="text-xs text-slate-500 mt-1">Members in your pool</p>
          </CardContent>
        </Card>

        <Card
          className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl overflow-hidden cursor-pointer group hover:border-teal-300 hover:bg-teal-50/30 transition-all duration-200"
          onClick={() => navigate("/create-chit-groups")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">Quick Action</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <FolderPlus className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-base font-semibold text-teal-700 group-hover:text-teal-800 flex items-center gap-2">
              Create New Group
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Start a new chit fund</p>
          </CardContent>
        </Card>
      </div>

      {stats.recentGroups.length > 0 && (
        <Card className="border border-slate-200/80 bg-white rounded-xl overflow-hidden card-elevated">
          <CardHeader className="border-b border-slate-100 px-5 py-4">
            <CardTitle className="text-base font-semibold text-slate-900">Recent Groups</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Your latest chit groups</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {stats.recentGroups.map((g: any, i: number) => (
                <div
                  key={g._id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  onClick={() => navigate(`/chit-groups/map-members/${g._id}`)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-slate-900 truncate block">{g.groupName}</span>
                      <span className="text-xs text-slate-500">
                        ₹{g.totalValue?.toLocaleString()} • {g.paymentType}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && stats.recentGroups.length === 0 && stats.groups === 0 && (
        <Card className="border border-dashed border-slate-200 bg-slate-50/30 rounded-xl overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No groups yet</h3>
            <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">Create your first chit group to get started.</p>
            <button
              onClick={() => navigate("/create-chit-groups")}
              className="mt-6 px-5 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Create Group
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
