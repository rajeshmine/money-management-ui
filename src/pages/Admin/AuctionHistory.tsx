import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

interface AuctionHistoryProps {
  refreshTrigger?: number;
}

export default function AuctionHistory({ refreshTrigger }: AuctionHistoryProps) {
  const { groupId } = useParams();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    api.get(`/api/auctions/group/${groupId}`)
      .then((data) => setHistory(data as never[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [groupId, refreshTrigger]);

  if (loading) return <div className="p-10 text-center">Loading History...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <History className="text-teal-600" /> Auction History / ஏல வரலாறு
      </h2>

      <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Past Installments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[80px]">No. (தவணை)</TableHead>
                <TableHead>Date (தேதி)</TableHead>
                <TableHead>Winner (பெயர்)</TableHead>
                <TableHead className="text-right">Winner Gets (ஏலம்)</TableHead>
                <TableHead className="text-right">Admin Fees (கட்டணம்)</TableHead>
                <TableHead className="text-right">Member Paid (1 சீட்டு)</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-slate-400">
                    No auction records found.
                  </TableCell>
                </TableRow>
              ) : (
                history?.map((auction: any) => (
                  <TableRow key={auction._id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-bold">#{auction.installmentNo}</TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(auction.auctionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-teal-700">
                        {auction.winnerId?.name || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-teal-700">
                      ₹{(auction.remainingAmount ?? auction.bidAmount ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-amber-600">
                      ₹{(auction.adminFees ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-sm">
                        ₹{auction.payableAmount.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                        onClick={async () => {
                          if (!confirm("Delete this auction record?")) return;
                          try {
                            await api.delete(`/api/auctions/${auction._id}`);
                            setHistory((h) => h.filter((a: any) => a._id !== auction._id));
                          } catch (e) {
                            alert(e instanceof Error ? e.message : "Delete failed");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}