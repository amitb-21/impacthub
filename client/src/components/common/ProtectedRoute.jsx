import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store";

const ProtectedRoute = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
