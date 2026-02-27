import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "../utils/auth";

export default function RequireAuth({ children }) {
  const session = getSession();
  const loc = useLocation();
  if (!session) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
