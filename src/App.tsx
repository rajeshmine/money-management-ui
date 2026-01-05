import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/Auth";
import Layout from "./components/Layout";
import DashboardHome from "./pages/DashboardHome"; // Your empty state content
import ProfilePage from "./pages/Profile";
import CreateGroup from "./pages/Admin/CreateGroup";
import MemberDashboard from "./pages/MemberDashboard";
import ManageAdmins from "./pages/SuperAdmin/ManageAdmins";
import GroupList from "./pages/Admin/GroupList";
import AddMembers from "./pages/Admin/AddMembers";
import GroupMembers from "./pages/Admin/GroupMembers";
import AuctionEntry from "./pages/Admin/AuctionEntry";
import MapMembersToGroup from "./pages/Admin/MapMembersToGroup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Dashboard Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/create-chit-groups" element={<CreateGroup />} />
          <Route path="/chit-groups" element={<GroupList />} />

          <Route path="/chit-groups/add-members/:groupId" element={<AddMembers />} />
          <Route path="/chit-groups/group-members" element={<GroupMembers />} />
          <Route path="/chit-groups/auctions/:groupId" element={<AuctionEntry />} />
          <Route path="/chit-groups/map-members/:groupId" element={<MapMembersToGroup />} />

          <Route path="/my-chit" element={<MemberDashboard />} />
          <Route path="/users" element={<ManageAdmins />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}