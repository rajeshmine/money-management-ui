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
      const res = await fetch('http://localhost:3001/api/super/admins');
      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to fetch admins");
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/super/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsOpen(false); // Close modal
        setFormData({ name: "", phone: "", password: "", companyName: "" }); // Reset form
        fetchAdmins(); // Refresh list
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      alert("System error");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (id: string) => {
    const res = await fetch(`http://localhost:3001/api/super/toggle-status/${id}`, {
      method: 'PATCH'
    });
    if (res.ok) fetchAdmins();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> Super Admin Dashboard
          </h2>
          <p className="text-slate-500 font-tamil">நிர்வாகிகளை நிர்வகிக்கவும் (Manage Admins)</p>
        </div>

        {/* CREATE ADMIN DIALOG */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
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
                <Button type="submit" className="w-full bg-blue-600" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Admin
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md">
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
                    <div className="text-xs flex items-center text-blue-600">
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