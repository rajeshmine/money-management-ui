import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, hasAdminAccess, hasSuperAdminAccess } from "@/lib/auth";
import AuthPage from "./pages/Auth";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import DashboardHome from "./pages/DashboardHome";
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
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/my-chit" element={<MemberDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/users" element={<RoleGuard requireSuperAdmin><ManageAdmins /></RoleGuard>} />
            <Route path="/dashboard" element={<RoleGuard requireAdmin><DashboardHome /></RoleGuard>} />
            <Route path="/create-chit-groups" element={<RoleGuard requireAdmin><CreateGroup /></RoleGuard>} />
            <Route path="/chit-groups" element={<RoleGuard requireAdmin><GroupList /></RoleGuard>} />
            <Route path="/chit-groups/add-members/:groupId" element={<RoleGuard requireAdmin><AddMembers /></RoleGuard>} />
            <Route path="/chit-groups/group-members" element={<RoleGuard requireAdmin><GroupMembers /></RoleGuard>} />
            <Route path="/chit-groups/auctions/:groupId" element={<RoleGuard requireAdmin><AuctionEntry /></RoleGuard>} />
            <Route path="/chit-groups/map-members/:groupId" element={<RoleGuard requireAdmin><MapMembersToGroup /></RoleGuard>} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to={isAuthenticated() ? (hasSuperAdminAccess() ? "/users" : hasAdminAccess() ? "/dashboard" : "/my-chit") : "/auth"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}