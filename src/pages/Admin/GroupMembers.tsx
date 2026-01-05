import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, UserMinus, Search, Users, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddMembers from "./AddMembers";

export default function GroupMembers() {
  const navigate = useNavigate();

  const [allGroups, setAllGroups] = useState([]); // For the dropdown
  const [members, setMembers] = useState([]);
  const [currentGroup, setCurrentGroup] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [groupId, setGroupId] = useState("");

  // 1. Fetch All Groups for the Dropdown
  useEffect(() => {
    const fetchAllGroups = async () => {
      const adminId = localStorage.getItem("id");
      const res = await fetch(`http://localhost:3001/api/groups/my-groups?adminId=${adminId}`);
      const data = await res.json();
      setAllGroups(data);
    };
    fetchAllGroups();
  }, []);

  // 2. Fetch Members for the Selected Group
  useEffect(() => {
    const fetchGroupData = async () => {
      const adminId = localStorage.getItem("id");
      if (!adminId) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/admin/all-members/${adminId}`);
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error("Error fetching group data");
      } finally {
        setLoading(false);
      }
    };
    fetchGroupData();
  }, []);

  const handleGroupChange = (newGroupId: string) => {
    setGroupId(newGroupId);
  };
  const filteredMembers = members?.filter((member: any) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  return (
    <>
      <AddMembers />
      <div className="p-6 space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="text-blue-600 h-6 w-6" />
              Member Directory
            </h2>
            <p className="text-sm text-slate-500 font-tamil">உறுப்பினர் விவரங்கள்</p>
          </div>

          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
            {/* GROUP SELECTOR DROPDOWN */}
            <div className="w-full sm:w-64">
              <Label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Switch Group</Label>
              <Select onValueChange={handleGroupChange} value={groupId}>
                <SelectTrigger className="bg-slate-50 border-blue-100 focus:ring-blue-500">
                  <SelectValue placeholder="Select a Group" />
                </SelectTrigger>
                <SelectContent>
                  {allGroups.map((group: any) => (
                    <SelectItem key={group._id} value={group._id}>
                      {group.groupName} ({group.paymentType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-64">
              <Label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Name or Phone..."
                  className="pl-9 bg-slate-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MEMBER TABLE CARD */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-white border-b py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-slate-700">
                Total Members
                <span className="ml-2 text-sm font-normal text-slate-400">
                  ({members?.length} Members)
                </span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/groups")}>
                <LayoutDashboard className="h-4 w-4 mr-2" /> All Groups
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[60px] text-center">#</TableHead>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10">Loading members...</TableCell></TableRow>
                ) : filteredMembers?.length > 0 ? (
                  filteredMembers?.map((member: any, index: number) => (
                    <TableRow key={member._id} className="hover:bg-blue-50/30 transition-colors">
                      <TableCell className="text-center font-mono text-slate-400">{index + 1}</TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">{member.name}</div>
                        <div className="text-[10px] text-slate-400">ID: {member._id.slice(-8)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm flex items-center gap-1.5 text-slate-600">
                          <Phone className="h-3 w-3" /> {member.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={member.status === "ACTIVE" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" : "bg-slate-100 text-slate-600"}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-600 hover:bg-red-50">
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-slate-400">No members found in this group.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Simple Label Component if not using shadcn Label
const Label = ({ children, className }: any) => (
  <label className={className}>{children}</label>
);