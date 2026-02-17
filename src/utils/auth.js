import { LS_KEYS, readJSON, writeJSON } from './storage'

const DEMO_USERS = {
  'admin@demo.com': { password: 'admin123', role: 'admin' },
  'viewer@demo.com': { password: 'viewer123', role: 'viewer' }
}

export function seedSessionData() {
  // no-op for now
}

export function login({ email, password }) {
  const user = DEMO_USERS[email]
  if (user && user.password === password) {
    const token = 'demo-token-' + Date.now()
    writeJSON(LS_KEYS.SESSION, { token, email, role: user.role })
    return { ok: true }
  }
  return { ok: false, message: 'Invalid credentials' }
}

export function logout() {
  localStorage.removeItem(LS_KEYS.SESSION)
}

export function getSession() {
  return readJSON(LS_KEYS.SESSION, null)
}

export function isAdmin() {
  const session = getSession()
  return session?.role === 'admin'
}

export function isViewer() {
  const session = getSession()
  return session?.role === 'viewer'
}

export function getRoleLabel() {
  const session = getSession()
  if (!session) return 'Unknown'
  const label = session.role === 'admin' ? 'Admin' : 'Viewer'
  return label
}
