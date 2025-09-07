import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../store";
import AdminPanel from "../../pages/Admin/AdminPanel";
import NGOAdminDashboard from "../../pages/NGO/NGOAdminDashboard";
import UserProfile from "../../pages/User/UserProfile";

const DashboardRouter = () => {
  const { currentUser } = useAuthStore();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Route based on user role
  switch (currentUser.role) {
    case "ADMIN":
      return <AdminPanel />;

    case "NGO_ADMIN":
      return <NGOAdminDashboard />;

    case "USER":
    default:
      return <UserProfile />;
  }
};

export default DashboardRouter;
