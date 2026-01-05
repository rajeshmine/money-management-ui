import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Gavel, Calculator, Calendar, User } from "lucide-react";
import AuctionHistory from "./AuctionHistory";

interface Member {
  _id: string;
  name: string;
  phone: string;
}
export default function AuctionEntry() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [group, setGroup] = useState<any>(null);

  // States based on the uploaded image
  const [bidAmount, setBidAmount] = useState(0); // தள்ளுபடி
  const [winnerId, setWinnerId] = useState("");
  const [installmentNo, setInstallmentNo] = useState(""); // தவணை
  const [auctionDate, setAuctionDate] = useState("2026-01-01"); // தேதி

  useEffect(() => {
    // Fetch members and group info
    fetch(`http://localhost:3001/api/groups/${groupId}/members`)
      .then(res => res.json())
      .then(data => {
        const uniqueMembers = Array.from(
          new Map(
            data.members
              .filter((m: any) => m !== null)
              .map((m: Member) => [m._id, m])
          ).values()
        ) as Member[]; // Cast the result to Member array

        // 2. This will no longer throw the 'never' error
        setMembers(uniqueMembers);
        // setMembers(data.members);
        setGroup(data.group);
      });
  }, [groupId]);


  // --- UPDATED CALCULATION LOGIC (2% Commission System) ---
  const totalChitValue = group?.totalValue || 200000;
  const totalMembers = group?.membersCount || 20;

  // 1. Organizer Commission (Fixed 2% of total value)
  const organizerCommission = totalChitValue * 0.02;

  // 2. Dividend (Bid Amount - Commission) divided by members
  // If Bid is 40,000: (40,000 - 4,000) / 20 = 1,800
  const totalDividendPool = bidAmount - organizerCommission;
  const dividendPerMember = totalDividendPool > 0 ? totalDividendPool / totalMembers : 0;

  // 3. 1 சீட்டுத் தொகை (What each member pays)
  // 10,000 - 1,800 = 8,200
  const baseInstallment = totalChitValue / totalMembers;
  const monthlyInstallment = baseInstallment - dividendPerMember;

  // 4. Winner Receives (மீதித்தொகை)
  const remainingAmount = totalChitValue - bidAmount;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      groupId,
      winnerId,
      bidAmount, // தள்ளுபடி
      installmentNo, // தவணை
      auctionDate,
      remainingAmount, // மீதித்தொகை
      payableAmount: monthlyInstallment, // 1 சீட்டுத் தொகை
      dividend: dividendPerMember
    };

    const res = await fetch('http://localhost:3001/api/auctions/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("ஏலம் வெற்றிகரமாக பதிவு செய்யப்பட்டது!");
      navigate(`/groups/members/${groupId}`);
    }
  };

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Gavel className="text-blue-600" /> Auction Entry / ஏலப் பதிவு
          </h2>
          <div className="text-right">
            <p className="text-sm text-gray-500 font-medium">Chit Value / சீட்டுத் தொகை</p>
            <p className="text-xl font-bold text-blue-600">₹{totalChitValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* INPUT FORM */}
          <Card className="shadow-md">
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
                  <Label>Installment / தவணை</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 12"
                    onChange={(e) => setInstallmentNo(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Winner Name / ஏலம் எடுத்தவர்</Label>
                <Select onValueChange={setWinnerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m: any) => (
                      <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bid (Discount) / தள்ளுபடி தொகை (₹)</Label>
                <Input
                  type="number"
                  className="text-lg font-semibold"
                  placeholder="e.g. 40000"
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                Save Auction Entry / பதிவு செய்
              </Button>
            </CardContent>
          </Card>

          {/* CALCULATION VIEW (Matches Paper Image) */}
          <Card className="bg-slate-900 text-white border-none shadow-xl">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-slate-400 flex items-center gap-2">
                <Calculator size={18} /> Receipt Preview / ரசீது
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">சீட்டுத் தொகை (Total Value)</span>
                <span className="text-lg font-medium">₹{totalChitValue.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">தள்ளுபடி (Bid Amount)</span>
                <span className="text-lg font-medium text-red-400">- ₹{bidAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                <span className="font-bold text-blue-300">மீதித்தொகை (Winner Balance)</span>
                <span className="text-xl font-bold text-blue-300">₹{remainingAmount.toLocaleString()}</span>
              </div>

              <hr className="border-slate-800" />

              <div className="flex justify-between items-center">
                <span className="text-slate-400">தவணை லாபம் (Dividend)</span>
                <span className="text-green-400">₹{dividendPerMember.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-sm text-slate-400">1 சீட்டுத் தொகை</p>
                  <p className="text-xs text-slate-500">(Monthly Installment)</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-green-500">
                    ₹{monthlyInstallment.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AuctionHistory />
    </>
  );
}