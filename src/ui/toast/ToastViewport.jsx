import React, { useContext } from "react";
import { ToastContext } from "./ToastContext";

export default function ToastViewport() {
  const { toasts, dismiss } = useContext(ToastContext);

  return (
    <>
      {/* Live region for accessibility */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
        id="toast-live-region"
      />

      {/* Toast stack */}
      <div className="toast-stack">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            role="alert"
            aria-label={`${toast.type}: ${toast.message}`}
          >
            <div className="toast-content">
              <span className="toast-message">{toast.message}</span>
            </div>
            <button
              className="toast-close"
              onClick={() => dismiss(toast.id)}
              aria-label="Close notification"
              type="button"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
