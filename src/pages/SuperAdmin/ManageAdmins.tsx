import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { UserPlus, Building2, ShieldCheck, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    companyName: ""
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await api.get("/api/super/admins");
      setAdmins(data as never[]);
    } catch {
      // Failed to fetch admins
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/super/create-admin", formData);
      setIsOpen(false);
      setFormData({ name: "", phone: "", password: "", companyName: "" });
      fetchAdmins();
    } catch (err) {
      alert(err instanceof Error ? err.message : "System error");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (id: string) => {
    try {
      await api.patch(`/api/super/toggle-status/${id}`);
      fetchAdmins();
    } catch {
      // Failed to toggle
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-teal-600" /> Manage Admins
          </h2>
          <p className="text-slate-500 font-tamil">நிர்வாகிகளை நிர்வகிக்கவும் (Manage Admins)</p>
        </div>

        {/* CREATE ADMIN DIALOG */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-teal-500/25">
              <UserPlus className="mr-2 h-4 w-4" /> Create New Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateAdmin}>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Enter details to create a new chit group administrator.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name / பெயர்</Label>
                  <Input 
                    id="name" 
                    required 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company Name / நிறுவனம்</Label>
                  <Input 
                    id="company" 
                    required 
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone / போன் எண்</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    required 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password / கடவுச்சொல்</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Admin
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle>Registered Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Admin / Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Access Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin: any) => (
                <TableRow key={admin._id}>
                  <TableCell>
                    <div className="font-bold text-slate-900">{admin.name}</div>
                    <div className="text-xs flex items-center text-teal-600">
                      <Building2 className="h-3 w-3 mr-1" /> {admin.companyName}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{admin.phone}</TableCell>
                  <TableCell>
                    <Badge variant={admin.status === "ACTIVE" ? "default" : "destructive"}>
                      {admin.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Switch 
                        checked={admin.status === "ACTIVE"} 
                        onCheckedChange={() => toggleAdminStatus(admin._id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}