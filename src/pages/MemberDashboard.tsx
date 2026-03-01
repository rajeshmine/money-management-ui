import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet, Info, CheckCircle, Users } from "lucide-react";
import { getStoredAuth } from "@/lib/auth";
import { api } from "@/lib/api";

interface Group {
  _id: string;
  groupName: string;
  totalValue: number;
  duration: number;
  membersCount: number;
  paymentType: string;
}

interface Auction {
  _id: string;
  installmentNo: number;
  auctionDate: string;
  groupId: { groupName: string };
  winnerId: { name: string };
  bidAmount: number;
  payableAmount: number;
  dividendPerMember: number;
}

export default function MemberDashboard() {
  const { name, id } = getStoredAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [payments, setPayments] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [groupsData, paymentsData] = await Promise.all([
          api.get<Group[]>("/api/members/my-groups"),
          api.get<Auction[]>("/api/members/my-payments"),
        ]);
        setGroups(groupsData ?? []);
        setPayments(paymentsData ?? []);
      } catch {
        setGroups([]);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const totalPaid = payments.reduce((sum, a) => sum + (a.payableAmount ?? 0), 0);
  const totalDividend = payments.reduce((sum, a) => sum + (a.dividendPerMember ?? 0), 0);
  const nextPayable = payments.length > 0 ? payments[0].payableAmount : 0;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center text-slate-500">Loading...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-fade-in">
      <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-teal-500/25">
        <p className="text-teal-100 text-sm">Welcome back / வருக,</p>
        <h2 className="text-2xl font-bold">{name || "Member"}</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
          {groups.slice(0, 3).map((g) => (
            <span key={g._id} className="bg-white/25 px-3 py-1 rounded-full text-sm">
              {g.groupName}
            </span>
          ))}
          {id && (
            <span className="bg-white/20 px-3 py-1 rounded-full">
              ID: #{String(id).slice(-6)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl bg-emerald-50/80">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <CheckCircle className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase">Total Paid</span>
            </div>
            <div className="text-xl font-bold text-slate-900">₹{totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl bg-teal-50/80">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-teal-600 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase">Total Savings</span>
            </div>
            <div className="text-xl font-bold text-slate-900">₹{totalDividend.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl bg-amber-50/80 col-span-2 md:col-span-1">
          <CardContent className="pt-4 text-center md:text-left">
            <div className="flex items-center gap-2 text-amber-600 mb-1 justify-center md:justify-start">
              <Wallet className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase">Last Installment</span>
            </div>
            <div className="text-xl font-bold text-slate-900">₹{nextPayable.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {groups.length > 0 && (
        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-500" />
              My Groups / எனது குழுக்கள்
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {groups.map((g) => (
                <div
                  key={g._id}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-sm font-medium"
                >
                  {g.groupName} — ₹{g.totalValue?.toLocaleString()} ({g.paymentType})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-teal-500" />
            Payment History / எனது வரலாறு
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Installment</th>
                  <th className="px-4 py-3 text-left">Group</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Winner</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-4 py-3 text-right">Dividend</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                      No payment records yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-4 font-medium">#{a.installmentNo}</td>
                      <td className="px-4 py-4">{a.groupId?.groupName ?? "—"}</td>
                      <td className="px-4 py-4 text-slate-600">
                        {a.auctionDate ? new Date(a.auctionDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-4 font-medium text-teal-700">
                        {a.winnerId?.name ?? "—"}
                      </td>
                      <td className="px-4 py-4 text-right">₹{(a.payableAmount ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-green-600">
                        ₹{(a.dividendPerMember ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
