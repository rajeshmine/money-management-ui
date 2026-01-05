import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, Calendar, Plus } from "lucide-react";

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const adminId = localStorage.getItem("id");
      const role = localStorage.getItem("role");
      const res = await fetch(`http://localhost:3001/api/groups/my-groups?adminId=${adminId}&role=${role}`);
      const data = await res.json();
      setGroups(data);
    };
    fetchGroups();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Chit Groups / சீட்டு குழுக்கள்</h2>
          <p className="text-slate-500">Manage your active and upcoming groups</p>
        </div>

        <div>
          <Button onClick={() => navigate("/create-chit-groups")} className="bg-blue-600">
            <Plus className="mr-2 h-4 w-4" /> Create New Group
          </Button>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group: any) => (
          <Card key={group._id} className="hover:shadow-md transition-shadow border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">{group.groupName}</CardTitle>
                <Badge variant={group.paymentType === "VARIABLE" ? "outline" : "secondary"}>
                  {group.paymentType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-500">Value: <span className="text-slate-900 font-semibold">₹{group.totalValue.toLocaleString()}</span></div>
                <div className="text-slate-500">Months: <span className="text-slate-900 font-semibold">{group.duration}</span></div>
              </div>

              <div className="flex items-center text-sm text-slate-500 bg-slate-50 p-2 rounded">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                Members: {group.membersCount || 0} / {group.membersLimit || 20}
              </div>

              <Button
                onClick={() => navigate(`/chit-groups/map-members/${group._id}`)}
                variant="outline"
                className="w-full mt-2 group hover:bg-blue-600 hover:text-white"
              >
                Map Members / உறுப்பினர்கள்
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
               <Button
                onClick={() => navigate(`/chit-groups/auctions/${group._id}`)}
                variant="outline"
                className="w-full mt-2 group hover:bg-blue-600 hover:text-white"
              >
                Auction
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}