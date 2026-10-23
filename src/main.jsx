import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ErrorBoundary } from "@/app/error-boundary";
import { AppProviders } from "@/app/providers";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <App />
      </AppProviders>
    </ErrorBoundary>
  </StrictMode>,
);
