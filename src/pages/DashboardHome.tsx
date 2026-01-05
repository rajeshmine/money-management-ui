export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Example of many cards to force a scroll */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-64 w-full rounded-xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center">
          Card {i}
        </div>
      ))}
    </div>
  );
}