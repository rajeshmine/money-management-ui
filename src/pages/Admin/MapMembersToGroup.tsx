import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Users } from "lucide-react";

export default function MapMembersToGroup() {
  const { groupId } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [allMembers, setAllMembers] = useState([]); 
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    const adminId = localStorage.getItem("id");
    
    // 1. Fetch Group Details
    fetch(`http://localhost:3001/api/groups/group-details/${groupId}`)
      .then(res => res.json())
      .then(data => {
        setGroup(data);
        // We create an array exactly the size of group limit (e.g. 20)
        // We fill it with IDs from the database, or empty strings if null
        const initial = Array(data.membersCount).fill("");
        if (data.members && data.members.length > 0) {
          data.members.forEach((m: any, idx: number) => {
            // Handle both populated objects or raw IDs
            initial[idx] = typeof m === 'object' ? m._id : m;
          });
        }
        setSelectedMembers(initial);
      });

    // 2. Fetch Master Member List
    fetch(`http://localhost:3001/api/admin/all-members/${adminId}`)
      .then(res => res.json())
      .then(data => setAllMembers(data));
  }, [groupId]);

  const handleAssign = async (memberId: string, index: number) => {
    // Send the specific slot index to the backend
    const res = await fetch(`http://localhost:3001/api/groups/assign-member`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, memberId, slotIndex: index })
    });

    if (res.ok) {
      const updated = [...selectedMembers];
      updated[index] = memberId;
      setSelectedMembers(updated);
    }
  };

  if (!group) return <div className="p-10 text-center">Loading Slots...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold">{group.groupName}</h2>
          <p className="text-slate-500">Total Slots: {group.membersCount}</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Users size={18} />
          <span className="font-semibold">
            {selectedMembers.filter(id => id !== "").length} / {group.membersCount} Filled
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        {Array.from({ length: group.membersCount }).map((_, index) => (
          <Card key={index} className={`${selectedMembers[index] ? "border-blue-200 bg-blue-50/30" : "border-slate-200"}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${selectedMembers[index] ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Slot Number</p>
                  {selectedMembers[index] ? (
                    <div className="flex items-center text-blue-700 font-semibold">
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