import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator, Users, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateChitGroup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    groupName: "",
    totalValue: 100000,
    duration: 20,
    membersCount: 20,
    paymentType: "VARIABLE"
  });

  const baseInstallment = formData.totalValue / formData.duration;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get logged-in admin details from storage
    const id = localStorage.getItem("id");
    const companyName = localStorage.getItem("companyName");
    const token = localStorage.getItem("token");

    const payload = {
      ...formData,
      adminId: id,
      companyName
    };

    try {
      const response = await fetch('http://localhost:3001/api/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // If using JWT
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("குழு வெற்றிகரமாக உருவாக்கப்பட்டது! (Group Created!)");
        navigate("/dashboard"); // Redirect to list
      } else {
        const errData = await response.json();
        alert("Error: " + errData.message);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Check if backend server is running.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Create New Group</h2>
          <p className="text-slate-500 font-tamil">புதிய ஏலக் குழுவை உருவாக்கவும்</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM SECTION */}
        <Card className="lg:col-span-2 shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg">Group Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
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
                    value={formData.totalValue}
                    onChange={(e) => setFormData({ ...formData, totalValue: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Months)</Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  />
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
                    className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all ${formData.paymentType === 'VARIABLE' ? 'border-blue-600 bg-blue-50' : 'hover:bg-slate-50'}`}
                  >
                    <RadioGroupItem value="VARIABLE" id="v" />
                    <div>
                      <span className="font-bold block">Variable (Auction)</span>
                      <span className="text-[11px] text-slate-500">ஏலத் தள்ளுபடி முறை</span>
                    </div>
                  </Label>

                  <Label
                    htmlFor="f"
                    className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all ${formData.paymentType === 'FIXED' ? 'border-blue-600 bg-blue-50' : 'hover:bg-slate-50'}`}
                  >
                    <RadioGroupItem value="FIXED" id="f" />
                    <div>
                      <span className="font-bold block">Fixed Amount</span>
                      <span className="text-[11px] text-slate-500">நிலையான தவணை</span>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-lg">
                Save & Initialize Group
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* SUMMARY & PREVIEW */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-0 shadow-xl overflow-hidden relative">
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
                  <span className="font-semibold text-green-400">₹{formData.totalValue.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
            <Info className="shrink-0 h-5 w-5 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold uppercase">Note for Admin:</p>
              {formData.paymentType === 'VARIABLE' ? (
                <p>In **Variable Mode**, this ₹{baseInstallment} is the maximum installment. The actual amount will be lower based on monthly auction bids.</p>
              ) : (
                <p>In **Fixed Mode**, members will pay exactly ₹{baseInstallment} every month for {formData.duration} months.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}