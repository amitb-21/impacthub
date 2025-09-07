import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store";

const RoleProtectedRoute = ({ allowedRoles = [] }) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on user's role
    switch (currentUser.role) {
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      case "NGO_ADMIN":
        return <Navigate to="/ngo-dashboard" replace />;
      case "USER":
      default:
        return <Navigate to="/profile" replace />;
    }
  }

  // For NGO_ADMIN routes, also check if they are verified
  if (currentUser.role === "NGO_ADMIN" && allowedRoles.includes("NGO_ADMIN")) {
    if (!currentUser.verified) {
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "#f59e0b",
          }}
        >
          <h2>Account Verification Pending</h2>
          <p>
            Your NGO Admin account is pending verification by an administrator.
          </p>
          <p>You will be able to access this section once verified.</p>
        </div>
      );
    }
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
