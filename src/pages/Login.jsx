import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, getSession } from "../utils/auth";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState(null);

  if (getSession()) {
    nav("/");
  }

  const submit = (e) => {
    e.preventDefault();
    const res = login({ email, password });
    if (res.ok) {
      const from = loc.state?.from?.pathname || "/";
      nav(from, { replace: true });
    } else setErr(res.message);
  };

  return (
    <div
      className="app"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div className="card" style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ marginBottom: 8 }}>CareerScope Admin</h1>
          <p style={{ color: "#475569", fontSize: "14px" }}>Demo Credentials</p>
        </div>
        <form onSubmit={submit}>
          <div className="form-row">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>
          <div className="form-row">
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {err && (
            <div className="error" style={{ marginBottom: 12 }}>
              {err}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button className="btn" type="submit" style={{ flex: 1 }}>
              Sign in
            </button>
            <button
              type="button"
              className="btn secondary"
              style={{ flex: 1 }}
              onClick={() => {
                setEmail("admin@demo.com");
                setPassword("admin123");
                setErr(null);
              }}
            >
              Admin
            </button>
            <button
              type="button"
              className="btn secondary"
              style={{ flex: 1 }}
              onClick={() => {
                setEmail("viewer@demo.com");
                setPassword("viewer123");
                setErr(null);
              }}
            >
              Viewer
            </button>
          </div>
        </form>
        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#EFF6FF",
            borderRadius: 6,
            border: "1px solid #DBEAFE",
          }}
        >
          <p style={{ fontSize: 12, color: "#0F172A", margin: "0 0 8px 0", fontWeight: 600 }}>
            Demo Accounts:
          </p>
          <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
            👤 <strong>Admin:</strong> admin@demo.com / admin123
          </p>
          <p style={{ fontSize: 12, color: "#475569", margin: "4px 0 0 0" }}>
            👁️ <strong>Viewer:</strong> viewer@demo.com / viewer123
          </p>
        </div>
      </div>
    </div>
  );
}
