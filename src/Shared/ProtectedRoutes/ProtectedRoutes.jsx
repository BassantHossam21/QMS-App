import { AuthContext } from "@/Context/AuthContext";
import React, { useContext } from "react";

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("accessToken");
  let { loginData } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && loginData && !allowedRoles.includes(loginData?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
