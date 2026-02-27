import React, { useEffect, useMemo, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import ExperienceFormModal from "../components/ExperienceFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { LS_KEYS, readJSON, writeJSON } from "../utils/storage";
import { getSession, isAdmin } from "../utils/auth";
import { exportData, downloadJSON, importData, readJSONFile } from "../utils/import-export";
import { exportSelectedExperiences } from "../utils/export-selected";
import { useToast } from "../ui/toast/useToast";

function seedIfEmpty() {
  const ex = readJSON(LS_KEYS.EXPERIENCES, null);
  if (!ex) {
    const sample = [
      {
        id: "1",
        title: "Frontend Developer",
        org: "Acme Co",
        category: "Full-time",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
        tags: ["react", "javascript"],
      },
      {
        id: "2",
        title: "Data Analyst",
        org: "DataCorp",
        category: "Contract",
        startDate: "2021-05-01",
        endDate: "2021-12-31",
        tags: ["sql", "python"],
      },
      {
        id: "3",
        title: "Intern",
        org: "Startup",
        category: "Internship",
        startDate: "2020-06-01",
        endDate: "2020-08-31",
        tags: ["excel"],
      },
    ];
    writeJSON(LS_KEYS.EXPERIENCES, sample);
  }
}

function getCategoryBadgeClass(category) {
  const map = {
    "Full-time": "blue",
    Contract: "indigo",
    Internship: "purple",
    "Part-time": "cyan",
    Freelance: "pink",
  };
  return map[category] || "blue";
}

export default function Experiences() {
  seedIfEmpty();
  const admin = isAdmin();
  const { notify } = useToast();
  const [items, setItems] = useState(() => readJSON(LS_KEYS.EXPERIENCES, []));
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const fileInputRef = useRef(null);

  useEffect(() => {
    writeJSON(LS_KEYS.EXPERIENCES, items);
  }, [items]);

  function saveExperience(data) {
    if (!data.id) {
      data.id = String(Date.now());
      setItems((i) => [...i, data]);
      appendAudit("CREATE", `Created experience ${data.title}`);
      notify({ type: "success", message: "Saved successfully" });
    } else {
      setItems((i) => i.map((x) => (x.id === data.id ? { ...x, ...data } : x)));
      appendAudit("UPDATE", `Updated experience ${data.title}`);
      notify({ type: "success", message: "Saved successfully" });
    }
    setModalOpen(false);
    setEditing(null);
  }

  function askDelete(item) {
    setConfirm(item);
  }
  function doDelete() {
    if (!confirm) return;
    setItems((i) => i.filter((x) => x.id !== confirm.id));
    appendAudit("DELETE", `Deleted experience ${confirm.title}`);
    notify({ type: "success", message: `Deleted experience` });
    setConfirm(null);
  }

  function appendAudit(action, message) {
    const actor = getSession()?.email || "unknown";
    const audit = readJSON(LS_KEYS.AUDIT, []);
    audit.push({ action, timestamp: new Date().toISOString(), actor, message });
    writeJSON(LS_KEYS.AUDIT, audit);
  }

  function handleExport() {
    const data = exportData();
    const filename = `careerscore-export-${new Date().toISOString().split("T")[0]}.json`;
    downloadJSON(data, filename);
    appendAudit("EXPORT", "Exported all data");
    notify({ type: "success", message: "Export downloaded" });
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleImportFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJSONFile(file);
      const result = importData(data);

      // Refresh experiences after import
      setItems(readJSON(LS_KEYS.EXPERIENCES, []));

      notify({
        type: "success",
        message: `Imported ${result.experiencesImported} experiences`,
      });

      appendAudit(
        "IMPORT",
        `Imported ${result.experiencesImported} experiences from file ${file.name}`
      );
    } catch (err) {
      notify({
        type: "error",
        message: `Import failed: ${err.message}`,
      });
    } finally {
      // Reset file input
      event.target.value = "";
    }
  }

  function toggleRowSelection(id) {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  function toggleSelectAll(allVisibleIds) {
    if (
      selectedIds.size === allVisibleIds.length &&
      allVisibleIds.every((id) => selectedIds.has(id))
    ) {
      // All visible are selected - deselect all visible
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        allVisibleIds.forEach((id) => newSet.delete(id));
        return newSet;
      });
    } else {
      // Select all visible
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        allVisibleIds.forEach((id) => newSet.add(id));
        return newSet;
      });
    }
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleExportSelected() {
    try {
      exportSelectedExperiences(results, selectedIds);
      notify({ type: "success", message: "Exported selected experiences" });
      appendAudit("EXPORT_SELECTED", `Exported ${selectedIds.size} selected experiences`);
      clearSelection();
    } catch (err) {
      notify({ type: "error", message: err.message });
    }
  }

  function handleDeleteSelected() {
    if (selectedIds.size === 0) {
      notify({ type: "error", message: "No rows selected" });
      return;
    }

    const count = selectedIds.size;
    const confirmed = window.confirm(
      `Delete ${count} selected experiences? This cannot be undone.`
    );
    if (!confirmed) return;

    // Find experiences to delete (from items, so we get the full data)
    const experiencesToDelete = items.filter((exp) => selectedIds.has(exp.id));

    // Delete from items
    setItems((prevItems) => prevItems.filter((exp) => !selectedIds.has(exp.id)));

    // Append audit logs for each deleted experience
    experiencesToDelete.forEach((exp) => {
      appendAudit("DELETE", `Deleted experience: ${exp.title} (${exp.org})`);
    });

    // Show success toast
    notify({ type: "success", message: `Deleted ${count} experiences` });

    // Clear selection
    clearSelection();
  }

  const results = useMemo(() => {
    const ql = q.toLowerCase().trim();
    let out = [...items];
    if (ql)
      out = out.filter(
        (x) =>
          (x.title || "").toLowerCase().includes(ql) ||
          (x.org || "").toLowerCase().includes(ql) ||
          (x.tags || []).join(" ").toLowerCase().includes(ql)
      );
    if (categoryFilter) out = out.filter((x) => x.category === categoryFilter);
    out.sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
    return out;
  }, [items, q, categoryFilter]);

  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));

  // Selection state for header checkbox
  const visibleIds = results.map((r) => r.id);
  const selectedVisibleCount = visibleIds.filter((id) => selectedIds.has(id)).length;
  const isAllSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
  const isIndeterminate = selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length;

  return (
    <div className="app">
      <Navbar />
      <div className="card">
        <h1>Experiences</h1>
        <div className="controls">
          <input
            className="search-input"
            placeholder="Search title, org, tags"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {admin && (
            <button
              className="btn"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              + New Experience
            </button>
          )}
          <button className="btn secondary" onClick={handleExport} title="Download as JSON">
            ↓ Export
          </button>
          {admin && (
            <>
              <button
                className="btn secondary"
                onClick={handleImportClick}
                title="Import JSON file"
              >
                ↑ Import
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                style={{ display: "none" }}
              />
            </>
          )}
        </div>

        {selectedIds.size > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 12,
              marginBottom: 16,
              backgroundColor: "#EFF6FF",
              border: "1px solid #DBEAFE",
              borderRadius: 6,
            }}
          >
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#0F172A" }}>
              Selected: {selectedIds.size}
            </span>
            <button className="btn secondary small" onClick={handleExportSelected}>
              ↓ Export selected
            </button>
            <button className="btn small danger" onClick={handleDeleteSelected}>
              🗑 Delete selected
            </button>
            <button className="btn secondary small" onClick={clearSelection}>
              ✕ Clear
            </button>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 32, paddingLeft: 12 }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={() => toggleSelectAll(visibleIds)}
                  aria-label="Select all visible"
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th>Title</th>
              <th>Organization</th>
              <th>Category</th>
              <th>Dates</th>
              <th>Tags</th>
              {admin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {results.map((it) => (
              <tr key={it.id}>
                <td style={{ paddingLeft: 12 }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(it.id)}
                    onChange={() => toggleRowSelection(it.id)}
                    aria-label={`Select ${it.title}`}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td>{it.title}</td>
                <td>{it.org}</td>
                <td>
                  <span className={`badge ${getCategoryBadgeClass(it.category)}`}>
                    {it.category}
                  </span>
                </td>
                <td>
                  {it.startDate} — {it.endDate}
                </td>
                <td>
                  {(it.tags || []).map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </td>
                {admin && (
                  <td>
                    <button
                      className="btn secondary small"
                      onClick={() => {
                        setEditing(it);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn small danger" onClick={() => askDelete(it)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <ExperienceFormModal
          initial={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={saveExperience}
        />
      )}
      {confirm && (
        <ConfirmDialog
          message={`Delete ${confirm.title}?`}
          onCancel={() => setConfirm(null)}
          onConfirm={doDelete}
        />
      )}
    </div>
  );
}
