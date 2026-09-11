import React from "react";
import ReactDOM from "react-dom/client";
import { DevotionalPage } from "./routes/devocional";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <DevotionalPage />
    </React.StrictMode>
  );
}
