import React, { useMemo } from "react";
import Navbar from "../components/Navbar";
import { LS_KEYS, readJSON } from "../utils/storage";

export default function Analytics() {
  const items = readJSON(LS_KEYS.EXPERIENCES, []);

  const tagCounts = useMemo(() => {
    const map = {};
    items.forEach((it) =>
      (it.tags || []).forEach((t) => {
        map[t] = (map[t] || 0) + 1;
      })
    );
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [items]);

  const categoryTotals = useMemo(() => {
    const map = {};
    items.forEach((it) => {
      map[it.category] = (map[it.category] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [items]);

  return (
    <div className="app">
      <Navbar />
      <div className="card">
        <h1>Skill Analytics</h1>
        <div style={{ display: "flex", gap: 40, marginTop: 24 }}>
          <div style={{ flex: 1 }}>
            <h3>Top 10 Skills</h3>
            <ol style={{ paddingLeft: 20, marginTop: 12 }}>
              {tagCounts.slice(0, 10).map(([tag, count]) => (
                <li key={tag} style={{ marginBottom: 10, color: "#0F172A" }}>
                  <strong>{tag}</strong>{" "}
                  <span style={{ color: "#475569", fontSize: "13px" }}>({count})</span>
                </li>
              ))}
            </ol>
            {tagCounts.length === 0 && <p style={{ color: "#989797" }}>No skills yet</p>}
          </div>
          <div style={{ flex: 1 }}>
            <h3>Experience by Category</h3>
            <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: 12 }}>
              {categoryTotals.map(([cat, count]) => (
                <li
                  key={cat}
                  style={{
                    marginBottom: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#0F172A" }}>{cat || "Unspecified"}</span>
                  <span
                    style={{
                      background: "#1D4ED8",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {count}
                  </span>
                </li>
              ))}
            </ul>
            {categoryTotals.length === 0 && <p style={{ color: "#989797" }}>No experiences yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

