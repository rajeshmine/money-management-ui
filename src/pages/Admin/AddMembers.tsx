import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function AddMembers() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [memberData, setMemberData] = useState({
    name: "",
    phone: "",
    password: "123", // Default password for members
    status: "ACTIVE",
    role: "MEMBER",
    createdBy: localStorage.getItem("id") || "" // Admin ID from localStorage
  });

  const handleRegisterAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post<{ memberId: string }>("/api/admin/create-member", memberData);
      setMemberData({ name: "", phone: "", password: "123", status: "ACTIVE", role: "MEMBER", createdBy: localStorage.getItem("id") || "" });
      if (groupId && res?.memberId) {
        await api.post("/api/admin/map-to-group", { memberId: res.memberId, chitGroupId: groupId });
      }
      alert(groupId ? "Member added and assigned to group!" : "Member registered!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Member already exists or error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate("/chit-groups")} className="rounded-xl -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Groups
      </Button>

      <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <UserPlus className="text-teal-600" /> 
            Add New Member to Group
          </CardTitle>
          <p className="text-sm text-slate-500 font-tamil">புதிய உறுப்பினரைச் சேர்க்கவும்</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisterAndAdd} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name / பெயர்</Label>
              <Input 
                placeholder="Ravi Kumar" 
                value={memberData.name}
                onChange={(e) => setMemberData({...memberData, name: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number / போன் எண்</Label>
              <Input 
                type="tel" 
                placeholder="9876543210" 
                value={memberData.phone}
                onChange={(e) => setMemberData({...memberData, phone: e.target.value})}
                required 
              />
            </div>
            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-teal-500/25">
                {loading ? "Adding..." : "Add Member to Group / உறுப்பினரைச் சேர்க்கவும்"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}