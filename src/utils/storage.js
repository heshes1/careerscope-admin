export const LS_KEYS = {
  SESSION: 'career_session',
  EXPERIENCES: 'career_experiences',
  AUDIT: 'career_audit'
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
