import React, { useCallback, useRef, useState, useEffect } from 'react'
import { ToastContext } from './ToastContext'
import ToastViewport from './ToastViewport'

let toastCount = 0

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timeoutsRef = useRef({})
  const liveRegionRef = useRef(null)

  // Dismiss toast
  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id])
      delete timeoutsRef.current[id]
    }
  }, [])

  // Notify function
  const notify = useCallback(({ type = 'info', message, durationMs = 3000 }) => {
    const id = String(++toastCount)

    // Create toast object
    const toast = {
      id,
      type,
      message,
      createdAt: Date.now(),
    }

    // Add toast to state
    setToasts((prev) => [...prev, toast])

    // Update live region for accessibility
    const liveRegion = document.getElementById('toast-live-region')
    if (liveRegion) {
      liveRegion.textContent = message
    }

    // Auto-dismiss after durationMs
    if (durationMs > 0) {
      const timeoutId = setTimeout(() => {
        dismiss(id)
      }, durationMs)
      timeoutsRef.current[id] = timeoutId
    }

    return id
  }, [dismiss])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout)
    }
  }, [])

  const value = {
    toasts,
    notify,
    dismiss,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  )
}
