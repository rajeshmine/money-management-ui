import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save auth data to browser
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        localStorage.setItem("companyName", data.companyName);
        localStorage.setItem("id", data.id);
        localStorage.setItem("phone", data.phone);

        // Role-based redirection
        if (data.role === "ADMIN") {
          navigate("/dashboard");
        } else {
          navigate("/my-chit");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-blue-600">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
            எ
          </div>
          <CardTitle className="text-2xl font-bold">Ela Chittu / ஏலச் சீட்டு</CardTitle>
          <p className="text-slate-500 text-sm">Welcome! Please enter your details</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Phone Number / போன் எண்</label>
              <Input 
                type="text" 
                placeholder="9876543210" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Password / கடவுச்சொல்</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-11"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login / உள்நுழையவும்"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}