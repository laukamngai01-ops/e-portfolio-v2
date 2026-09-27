import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "@fontsource-variable/archivo";
import "./index.css";
import "./liquid-glass.css";
import App from "./App.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Cover snapshots require navigation to commit inside the native transition callback. */}
    <HashRouter useTransitions={false}>
      <App />
    </HashRouter>
  </StrictMode>,
);
