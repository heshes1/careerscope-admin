import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AppErrorBoundary } from "./components/AppErrorBoundary.jsx";
import ToastProvider from "./ui/toast/ToastProvider.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);
