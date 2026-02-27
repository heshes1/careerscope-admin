import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getSession, logout, getRoleLabel } from "../utils/auth";

export default function Navbar() {
  const nav = useNavigate();
  const session = getSession();
  const roleLabel = getRoleLabel();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="navbar card">
      <div style={{ fontWeight: 700 }}>CareerScope Admin</div>
      <div className="nav-links">
        <NavLink to="/" end>
          Experiences
        </NavLink>
        <NavLink to="/analytics">Analytics</NavLink>
        <NavLink to="/audit">Audit Log</NavLink>
      </div>
      <div className="logout">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span className="muted small" style={{ marginRight: 0 }}>
              {session?.email}
            </span>
            <span style={{ fontSize: "11px", color: "#989797", fontWeight: 500 }}>
              <span
                style={{
                  background: "#1D4ED8",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: 4,
                  display: "inline-block",
                }}
              >
                {roleLabel}
              </span>
            </span>
          </div>
        </div>
        <button className="btn secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
