import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, Plus, Trash2, UserPlus, Gavel } from "lucide-react";
import { api } from "@/lib/api";

export default function GroupList() {
  const [groups, setGroups] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    const adminId = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    const data = await api.get(`/api/groups/my-groups?adminId=${adminId}&role=${role}`);
    setGroups((data as any[]) ?? []);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = async (group: any) => {
    const groupId = typeof group._id === "object" ? group._id?.toString?.() : String(group._id ?? "");
    const groupName = group.groupName || "this group";
    if (!confirm(`Delete group "${groupName}"? Only possible if it has no auction history.`)) return;
    try {
      await api.delete(`/api/groups/${groupId}`);
      setGroups((prev) => prev.filter((g) => (g._id?.toString?.() ?? g._id) !== groupId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const statusVariant = (s: string) =>
    s === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : s === "ACTIVE" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Chit Groups</h1>
          <p className="text-slate-500 mt-1 text-sm">சீட்டு குழுக்கள் — Manage your groups</p>
        </div>
        <Button
          onClick={() => navigate("/create-chit-groups")}
          className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group: any) => (
          <Card
            key={group._id}
            className="border border-slate-200/80 bg-white rounded-xl overflow-hidden hover:border-slate-300/80 transition-all duration-200 card-elevated"
          >
            <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-base font-semibold text-slate-900 truncate">{group.groupName}</CardTitle>
                <div className="flex gap-1.5 shrink-0">
                  <Badge className={statusVariant(group.status || "UPCOMING") + " text-xs"}>
                    {group.status || "UPCOMING"}
                  </Badge>
                  <Badge variant="outline" className="text-slate-600 text-xs">
                    {group.paymentType}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-4 pb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-500">Value: <span className="font-medium text-slate-800">₹{group.totalValue?.toLocaleString()}</span></div>
                <div className="text-slate-500">Months: <span className="font-medium text-slate-800">{group.duration}</span></div>
              </div>

              <div className="flex items-center text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2.5">
                <Users className="h-4 w-4 mr-2 text-teal-500" />
                Members: {group.membersCount || 0} / {group.membersCount || 20}
              </div>

              <div className="flex flex-col gap-1.5">
                <Button
                  onClick={() => navigate(`/chit-groups/add-members/${group._id}`)}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-lg justify-start hover:bg-teal-50 hover:border-teal-200 h-9 group"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Add Members
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button
                  onClick={() => navigate(`/chit-groups/map-members/${group._id}`)}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-lg justify-start hover:bg-teal-50 hover:border-teal-200 h-9 group"
                >
                  <Users className="mr-2 h-4 w-4" /> Map Members
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button
                  onClick={() => navigate(`/chit-groups/auctions/${group._id}`)}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-lg justify-start hover:bg-teal-50 hover:border-teal-200 h-9 group"
                >
                  <Gavel className="mr-2 h-4 w-4" /> Auction
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 h-8 text-sm"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(group); }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <Card className="border border-dashed border-slate-200 bg-slate-50/30 rounded-xl overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No groups yet</h3>
            <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">Create your first chit group to get started.</p>
            <button
              onClick={() => navigate("/create-chit-groups")}
              className="mt-6 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Create Group
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
