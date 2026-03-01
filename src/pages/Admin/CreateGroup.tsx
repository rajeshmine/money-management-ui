import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

export default function CreateChitGroup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    groupName: "",
    totalValue: 100000,
    duration: 20,
    membersCount: 20,
    paymentType: "VARIABLE"
  });

  const count = formData.membersCount; // same as duration
  const baseInstallment = formData.totalValue / count;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = localStorage.getItem("id");
    const companyName = localStorage.getItem("companyName");

    const payload = {
      ...formData,
      adminId: id,
      companyName
    };

    try {
      await api.post("/api/groups/create", payload);
      alert("குழு வெற்றிகரமாக உருவாக்கப்பட்டது! (Group Created!)");
      navigate("/dashboard");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Check if backend server is running.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Create New Group</h1>
        <p className="text-slate-500 mt-1 text-sm">புதிய ஏலக் குழுவை உருவாக்கவும்</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-slate-200/80 bg-white rounded-xl overflow-hidden card-elevated">
          <CardHeader className="border-b border-slate-100 px-5 py-4">
            <CardTitle className="text-base font-semibold text-slate-900">Group Configuration</CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-5">
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="gname">Group Name / குழு பெயர்</Label>
                <Input
                  id="gname"
                  placeholder="e.g. Gold-Chit-2026-A"
                  onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Total Value (₹)</Label>
                  <Input
                    type="number"
                    id="value"
                    value={formData.totalValue}
                    onChange={(e) => setFormData({ ...formData, totalValue: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="membersCount">Members & Duration / உறுப்பினர்கள் & தவணை</Label>
                  <Input
                    type="number"
                    id="membersCount"
                    min={2}
                    value={formData.membersCount}
                    onChange={(e) => {
                      const count = Math.max(2, Number(e.target.value) || 2);
                      setFormData({ ...formData, membersCount: count, duration: count });
                    }}
                  />
                  <p className="text-xs text-slate-500">Same value for members count and installments (months)</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Payment Structure / கட்டண முறை</Label>
                <RadioGroup
                  defaultValue="VARIABLE"
                  onValueChange={(val) => setFormData({ ...formData, paymentType: val })}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="v"
                    className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-all ${formData.paymentType === 'VARIABLE' ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-200' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <RadioGroupItem value="VARIABLE" id="v" />
                    <div>
                      <span className="font-bold block">Variable (Auction)</span>
                      <span className="text-[11px] text-slate-500">ஏலத் தள்ளுபடி முறை</span>
                    </div>
                  </Label>

                  <Label
                    htmlFor="f"
                    className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-all ${formData.paymentType === 'FIXED' ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-200' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <RadioGroupItem value="FIXED" id="f" />
                    <div>
                      <span className="font-bold block">Fixed Amount</span>
                      <span className="text-[11px] text-slate-500">நிலையான தவணை</span>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 h-11 rounded-lg font-medium">
                Save & Initialize Group
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* SUMMARY & PREVIEW */}
        <div className="space-y-4">
          <Card className="bg-slate-900 text-white border-0 rounded-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calculator size={80} />
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest">Calculated Installment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-4xl font-bold">₹{baseInstallment.toLocaleString()}</span>
                <span className="text-slate-400 ml-1">/month</span>
              </div>
              <div className="pt-4 border-t border-slate-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Members</span>
                  <span className="font-semibold">{formData.membersCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Collection</span>
                  <span className="font-semibold text-emerald-400">₹{formData.totalValue.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200/80 rounded-lg p-4 flex gap-3 text-amber-800">
            <Info className="shrink-0 h-5 w-5 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold uppercase">Note for Admin:</p>
              {formData.paymentType === 'VARIABLE' ? (
                <p>In **Variable Mode**, this ₹{baseInstallment} is the maximum installment. The actual amount will be lower based on monthly auction bids.</p>
              ) : (
                <p>In **Fixed Mode**, members will pay exactly ₹{baseInstallment} every month for {count} months.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}