import React, { useCallback, useEffect, useRef, useState } from "react";
import { ToastContext } from "./ToastContext";
import ToastViewport from "./ToastViewport";

let toastCount = 0;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));

    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
  }, []);

  const notify = useCallback(
    ({ type = "info", message, durationMs = 3000 }) => {
      const id = String(++toastCount);
      const toast = {
        id,
        type,
        message,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev, toast]);

      const liveRegion = document.getElementById("toast-live-region");
      if (liveRegion) {
        liveRegion.textContent = message;
      }

      if (durationMs > 0) {
        const timeoutId = setTimeout(() => {
          dismiss(id);
        }, durationMs);

        timeoutsRef.current[id] = timeoutId;
      }

      return id;
    },
    [dismiss]
  );

  useEffect(() => {
    const timeouts = timeoutsRef.current;

    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);

  const value = {
    toasts,
    notify,
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}
