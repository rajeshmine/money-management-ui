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
import { Badge } from "@/components/ui/badge";
import { History, TrendingDown, Users } from "lucide-react";

export default function AuctionHistory() {
  const { groupId } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/auctions/group/${groupId}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [groupId]);

  if (loading) return <div className="p-10 text-center">Loading History...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="text-blue-600" /> Auction History / ஏல வரலாறு
        </h2>
      </div>

      <Card className="border-none shadow-md">
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
                <TableHead className="text-right">Bid (தள்ளுபடி)</TableHead>
                <TableHead className="text-right">Winner Received (மீதி)</TableHead>
                <TableHead className="text-right">Member Paid (1 சீட்டு)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-400">
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
                      <div className="font-semibold text-blue-700">
                        {auction.winnerId?.name || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      - ₹{auction.bidAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{auction.remainingAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-sm">
                        ₹{auction.payableAmount.toLocaleString()}
                      </Badge>
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