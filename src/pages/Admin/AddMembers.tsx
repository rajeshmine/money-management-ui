import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, Save, ArrowLeft } from "lucide-react";

export default function AddMembers() {
  const { groupId } = useParams(); // Get ID from URL
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
      // 1. Create User/Member API call
      const res = await fetch('http://localhost:3001/api/admin/create-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...memberData }),
      });

      if (res.ok) {
        alert("Member registered!");
        setMemberData({ name: "", phone: "", password: "123", status: "ACTIVE", role: "MEMBER", createdBy: localStorage.getItem("id") || "" });
      } else {
        alert("Member already exists or error occurred.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate("/groups")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Groups
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <UserPlus className="text-blue-600" /> 
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
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                {loading ? "Adding..." : "Add Member to Group / உறுப்பினரைச் சேர்க்கவும்"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}