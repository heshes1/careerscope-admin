import React, { useState, useEffect } from "react";

export default function ExperienceFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    id: "",
    title: "",
    org: "",
    category: "",
    startDate: "",
    endDate: "",
    tags: "",
  });

  useEffect(() => {
    if (initial) setForm({ ...initial, tags: (initial.tags || []).join(", ") });
  }, [initial]);

  function update(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal card">
        <h3>{form.id ? "Edit" : "Create"} Experience</h3>
        <form onSubmit={submit}>
          <div className="form-row">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
            />
            <input
              placeholder="Organization"
              value={form.org}
              onChange={(e) => update("org", e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              required
            />
            <input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => update("tags", e.target.value)}
            />
          </div>
          <div className="form-row">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
            />
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => update("endDate", e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
