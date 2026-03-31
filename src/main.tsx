import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import App from "./app/App";
import { convex } from "./lib/convex";
import { ThemeProvider } from "./components/ui/theme-provider";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="gainly-ui-theme">
      <ConvexAuthProvider client={convex}>
        <App />
      </ConvexAuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

