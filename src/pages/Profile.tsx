export default function ProfilePage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Your Profile</h2>
      <p className="text-slate-500">Manage your account settings and preferences.</p>
      <div className="mt-6 p-6 border rounded-lg bg-white">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> john@example.com</p>
      </div>
    </div>
  );
}