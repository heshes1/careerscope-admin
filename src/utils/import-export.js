import { LS_KEYS, readJSON, writeJSON } from "./storage";

/**
 * Validate experience object schema
 */
function isValidExperience(exp) {
  if (typeof exp !== "object" || exp === null) return false;
  if (typeof exp.id !== "string" || !exp.id) return false;
  if (typeof exp.title !== "string" || !exp.title) return false;
  if (typeof exp.org !== "string") return false;
  if (typeof exp.category !== "string") return false;
  if (typeof exp.startDate !== "string") return false;
  if (typeof exp.endDate !== "string") return false;
  if (!Array.isArray(exp.tags)) return false;
  if (!exp.tags.every((t) => typeof t === "string")) return false;
  return true;
}

/**
 * Validate audit log entry schema
 */
function isValidAuditEntry(entry) {
  if (typeof entry !== "object" || entry === null) return false;
  if (typeof entry.timestamp !== "string") return false;
  if (typeof entry.action !== "string") return false;
  if (typeof entry.actor !== "string") return false;
  if (typeof entry.message !== "string") return false;
  return true;
}

/**
 * Validate import data structure
 */
export function validateImportData(data) {
  if (typeof data !== "object" || data === null) {
    return { valid: false, error: "Invalid data: must be an object" };
  }

  // Check experiences
  if (!Array.isArray(data.experiences)) {
    return { valid: false, error: "Invalid data: experiences must be an array" };
  }
  if (data.experiences.length > 0 && !data.experiences.every(isValidExperience)) {
    return { valid: false, error: "Invalid experience entry: missing or invalid fields" };
  }

  // Check audit log (optional, can be empty)
  if (!Array.isArray(data.audit)) {
    return { valid: false, error: "Invalid data: audit must be an array" };
  }
  if (data.audit.length > 0 && !data.audit.every(isValidAuditEntry)) {
    return { valid: false, error: "Invalid audit entry: missing or invalid fields" };
  }

  return { valid: true };
}

/**
 * Export all data (experiences + audit log) as JSON
 */
export function exportData() {
  const experiences = readJSON(LS_KEYS.EXPERIENCES, []);
  const audit = readJSON(LS_KEYS.AUDIT, []);

  const data = {
    experiences,
    audit,
    exportedAt: new Date().toISOString(),
    version: "1.0",
  };

  return data;
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON (replaces existing localStorage data)
 */
export function importData(data) {
  const validation = validateImportData(data);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  writeJSON(LS_KEYS.EXPERIENCES, data.experiences);
  writeJSON(LS_KEYS.AUDIT, data.audit);

  return {
    experiencesImported: data.experiences.length,
    auditEntriesImported: data.audit.length,
  };
}

/**
 * Read JSON file from input
 */
export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (_err) {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
