import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Wallet, Info, CheckCircle } from "lucide-react";

export default function MemberDashboard() {
  // Mock data for a single member: "Ravi Kumar"
  const memberName = "Ravi Kumar";
  const groupName = "Ela-5000-A";
  const totalPaid = 13200;
  const totalDividendSaved = 2800; // Money saved due to auction discounts

  const paymentHistory = [
    { month: 1, base: 5000, dividend: 1200, paid: 3800, date: "05 Jan 2026", status: "Paid" },
    { month: 2, base: 5000, dividend: 1000, paid: 4000, date: "02 Feb 2026", status: "Paid" },
    { month: 3, base: 5000, dividend: 600, paid: 4400, date: "-", status: "Pending" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* WELCOME HEADER */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-blue-100 text-sm">Welcome back / வருக,</p>
        <h2 className="text-2xl font-bold">{memberName}</h2>
        <div className="mt-4 flex gap-4 text-xs font-medium">
          <span className="bg-white/20 px-3 py-1 rounded-full">Group: {groupName}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">ID: #042</span>
        </div>
      </div>

      {/* MEMBER STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CheckCircle className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase">Total Paid</span>
            </div>
            <div className="text-xl font-bold text-slate-900">₹{totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase">Total Savings</span>
            </div>
            <div className="text-xl font-bold text-slate-900">₹{totalDividendSaved.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-amber-50 col-span-2 md:col-span-1">
          <CardContent className="pt-4 text-center md:text-left">
            <div className="flex items-center gap-2 text-amber-600 mb-1 justify-center md:justify-start">
              <Wallet className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase">Next Payable</span>
            </div>
            <div className="text-xl font-bold text-slate-900">₹4,400</div>
          </CardContent>
        </Card>
      </div>

      {/* PAYMENT HISTORY */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-slate-400" />
            My Payment History / எனது வரலாறு
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Month</th>
                  <th className="px-4 py-3 text-left">Paid Amount</th>
                  <th className="px-4 py-3 text-left">Dividend</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paymentHistory.map((item) => (
                  <tr key={item.month} className="hover:bg-slate-50/50">
                    <td className="px-4 py-4 font-medium">Month {item.month}</td>
                    <td className="px-4 py-4">
                      <div>₹{item.paid}</div>
                      <div className="text-[10px] text-slate-400">{item.date}</div>
                    </td>
                    <td className="px-4 py-4 text-green-600 font-medium">₹{item.dividend}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {item.status === "Paid" ? "PAID" : "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}