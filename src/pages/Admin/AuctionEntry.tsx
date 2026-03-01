import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Gavel, Calculator } from "lucide-react";
import AuctionHistory from "./AuctionHistory";
import { api } from "@/lib/api";

interface Member {
  _id: string;
  name: string;
  phone: string;
}
export default function AuctionEntry() {
  const { groupId } = useParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [group, setGroup] = useState<any>(null);

  // States based on the uploaded image
  const [bidAmount, setBidAmount] = useState(0); // Amount winner receives
  const [adminFees, setAdminFees] = useState(0); // Admin consultation fees
  const [winnerId, setWinnerId] = useState("");
  const [installmentNo, setInstallmentNo] = useState<string>(""); // தவணை
  const [auctionDate, setAuctionDate] = useState("2026-01-01"); // தேதி

  const [existingAuctions, setExistingAuctions] = useState<any[]>([]);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  const loadData = () => {
    if (!groupId) return;
    Promise.all([
      api.get(`/api/groups/${groupId}/members`),
      api.get(`/api/auctions/group/${groupId}`).catch(() => [])
    ]).then(([membersData, auctionsData]: [any, any]) => {
      const uniqueMembers = Array.from(
        new Map(
          membersData.members
            ?.filter((m: any) => m !== null)
            ?.map((m: Member) => [m._id, m]) ?? []
        ).values()
      ) as Member[];
      setMembers(uniqueMembers);
      setGroup(membersData.group);
      const auctions = Array.isArray(auctionsData) ? auctionsData : [];
      setExistingAuctions(auctions);
      const totalInstallments = membersData.group?.membersCount ?? membersData.group?.duration ?? 1;
      const maxNo = auctions.length > 0 ? Math.max(...auctions.map((a: any) => a.installmentNo || 0)) : 0;
      setInstallmentNo((prev) => prev || String(Math.min(maxNo + 1, totalInstallments)));
    });
  };

  useEffect(() => {
    loadData();
  }, [groupId]);

  useEffect(() => {
    if (historyRefreshTrigger > 0 && groupId) {
      api.get(`/api/auctions/group/${groupId}`).then((data: any) => {
        setExistingAuctions(Array.isArray(data) ? data : []);
      }).catch(() => {});
    }
  }, [historyRefreshTrigger, groupId]);


  // Members who already won in this group - disable in winner selection
  const winnerIds = new Set(
    existingAuctions.map((a: any) => {
      const w = a.winnerId;
      return typeof w === "object" && w?._id ? w._id : w;
    }).filter(Boolean)
  );

  // --- UPDATED CALCULATION: bidAmount + adminFees = total collected from all members ---
  const totalChitValue = group?.totalValue || 200000;
  const totalMembers = group?.membersCount || 20;

  // Winner receives bid amount; admin gets consultation fees
  // Total collected = bidAmount + adminFees
  // Each member pays = (bidAmount + adminFees) / totalMembers
  const totalCollected = bidAmount + adminFees;
  const payableAmount = totalMembers > 0 ? totalCollected / totalMembers : 0;
  const remainingAmount = bidAmount; // Winner receives bid amount


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      groupId,
      winnerId,
      bidAmount,
      adminFees,
      installmentNo,
      auctionDate,
      remainingAmount,
      chitValue: totalChitValue,
      payableAmount,
      dividendPerMember: 0
    };

    try {
      await api.post("/api/auctions/entry", payload);
      alert("ஏலம் வெற்றிகரமாக பதிவு செய்யப்பட்டது!");
      setHistoryRefreshTrigger((k) => k + 1);
      setBidAmount(0);
      setAdminFees(0);
      setWinnerId("");
      const totalInstallments = group?.membersCount ?? group?.duration ?? 1;
      setInstallmentNo(String(Math.min(Number(installmentNo) + 1, totalInstallments)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save auction");
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Gavel className="text-teal-600" /> Auction Entry / ஏலப் பதிவு
          </h2>
          <div className="text-right bg-teal-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-slate-500 font-medium">Chit Value</p>
            <p className="text-xl font-bold text-teal-700">₹{totalChitValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Auction Details / விவரங்கள்</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date / தேதி</Label>
                  <Input type="date" value={auctionDate} onChange={(e) => setAuctionDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Installment / தவணை (1 of {group?.membersCount ?? group?.duration ?? "—"} members)</Label>
                  <Select value={installmentNo} onValueChange={setInstallmentNo}>
                    <SelectTrigger>
                      <SelectValue placeholder={group ? `Select 1–${group.membersCount ?? group.duration}` : "Select installment"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: Math.max(1, group?.membersCount ?? group?.duration ?? 1) }, (_, i) => i + 1).map((n) => {
                        const total = group?.membersCount ?? group?.duration ?? 1;
                        return (
                          <SelectItem key={n} value={String(n)}>
                            #{n} of {total} {n === total ? "(Last - completes chit)" : ""}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Winner Name / ஏலம் எடுத்தவர்</Label>
                <Select value={winnerId} onValueChange={setWinnerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Member (already-won disabled)" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m: any) => {
                      const hasWon = winnerIds.has(m._id);
                      return (
                        <SelectItem
                          key={m._id}
                          value={m._id}
                          disabled={hasWon}
                        >
                          {m.name} {hasWon ? "(Already won)" : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bid Amount (Winner Receives) / ஏலம் எடுத்தவருக்கு (₹)</Label>
                <Input
                  type="number"
                  className="text-lg font-semibold"
                  placeholder="e.g. 40000"
                  value={bidAmount || ""}
                  onChange={(e) => setBidAmount(Number(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label>Admin Consultation Fees / நிர்வாக கட்டணம் (₹)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 1000"
                  value={adminFees || ""}
                  onChange={(e) => setAdminFees(Number(e.target.value) || 0)}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white mt-4 rounded-xl shadow-lg shadow-teal-500/25">
                Save Auction Entry / பதிவு செய்
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-slate-400 flex items-center gap-2">
                <Calculator size={18} /> Receipt Preview / ரசீது
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Winner Receives (ஏலம் எடுத்தவருக்கு)</span>
                <span className="text-lg font-medium text-teal-300">₹{bidAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Admin Fees (நிர்வாக கட்டணம்)</span>
                <span className="text-lg font-medium text-amber-400">₹{adminFees.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                <span className="font-bold text-slate-300">Total Collected (அனைவரும் செலுத்தியது)</span>
                <span className="text-xl font-bold">₹{totalCollected.toLocaleString()}</span>
              </div>

              <hr className="border-slate-800" />

              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-sm text-slate-400">Each Member Pays (1 சீட்டுத் தொகை)</p>
                  <p className="text-xs text-slate-500">(bid + admin fees) ÷ {totalMembers} members</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-green-500">
                    ₹{payableAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AuctionHistory refreshTrigger={historyRefreshTrigger} />
    </>
  );
}