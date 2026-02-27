import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.jsx";
import Analytics from "./pages/Analytics.jsx";
import AuditLog from "./pages/AuditLog.jsx";
import Experiences from "./pages/Experiences.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Experiences />
          </RequireAuth>
        }
      />
      <Route
        path="/analytics"
        element={
          <RequireAuth>
            <Analytics />
          </RequireAuth>
        }
      />
      <Route
        path="/audit"
        element={
          <RequireAuth>
            <AuditLog />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
