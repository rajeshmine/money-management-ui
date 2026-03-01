import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Users } from "lucide-react";
import { api } from "@/lib/api";

export default function MapMembersToGroup() {
  const { groupId } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    const adminId = localStorage.getItem("id");
    if (!groupId) return;

    const load = async () => {
      const [groupData, membersData] = await Promise.all([
        api.get(`/api/groups/group-details/${groupId}`),
        api.get(`/api/admin/all-members/${adminId}`)
      ]) as [any, any[]];

      setGroup(groupData);
      const initial = Array(groupData.membersCount).fill("");
      if (groupData.members?.length > 0) {
        groupData.members.forEach((m: any, idx: number) => {
          initial[idx] = typeof m === "object" ? m._id : m;
        });
      }
      setSelectedMembers(initial);
      setAllMembers(membersData);
    };
    load();
  }, [groupId]);

  const handleAssign = async (memberId: string, index: number) => {
    try {
      await api.post("/api/groups/assign-member", { groupId, memberId, slotIndex: index });
      const updated = [...selectedMembers];
      updated[index] = memberId;
      setSelectedMembers(updated);
    } catch {
      // Error - slot may already be assigned or invalid
    }
  };

  if (!group) return <div className="p-10 text-center text-slate-500">Loading Slots...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{group.groupName}</h2>
          <p className="text-slate-500 mt-1">Total Slots: {group.membersCount}</p>
        </div>
        <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
          <Users size={18} />
          <span className="font-semibold">
            {selectedMembers.filter(id => id !== "").length} / {group.membersCount} Filled
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        {Array.from({ length: group.membersCount }).map((_, index) => (
          <Card key={index} className={`rounded-2xl ${selectedMembers[index] ? "border-teal-200 bg-teal-50/50" : "border-slate-200"}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${selectedMembers[index] ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Slot Number</p>
                  {selectedMembers[index] ? (
                    <div className="flex items-center text-teal-700 font-semibold">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Assigned
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic">Waiting for member...</p>
                  )}
                </div>
              </div>

              <div className="w-80">
                <Select 
                  value={selectedMembers[index] || ""} 
                  onValueChange={(val) => handleAssign(val, index)}
                >
                  <SelectTrigger className="bg-white border-slate-300">
                    <SelectValue placeholder="Select Member" />
                  </SelectTrigger>
                  <SelectContent>
                    {allMembers.map((m: any) => (
                      <SelectItem key={m._id} value={m._id}>
                        {m.name} — {m.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}