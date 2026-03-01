import { getStoredAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Building2 } from "lucide-react";

export default function ProfilePage() {
  const { name, role, id } = getStoredAuth();
  const phone = localStorage.getItem("phone");
  const companyName = localStorage.getItem("companyName");

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Your Profile</h2>
      <p className="text-slate-500">உங்கள் சுயவிவரம் — Manage your account</p>

      <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 w-28">Name:</span>
            <span className="font-medium">{name || "—"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500 w-28">Phone:</span>
            <span className="font-medium">{phone || "—"}</span>
          </div>
          {companyName && (
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500 w-28">Company:</span>
              <span className="font-medium">{companyName}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="text-slate-500 w-28">Role:</span>
            <span className="font-medium px-2 py-0.5 rounded-xl bg-teal-100 text-teal-800 text-sm">
              {role || "—"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 w-28">ID:</span>
            <span className="font-mono text-xs text-slate-600">{id ? String(id).slice(-12) : "—"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
