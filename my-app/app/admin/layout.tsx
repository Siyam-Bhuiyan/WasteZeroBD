"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMode, ColorModeContext } from "./theme";
import Sidebar from "./global/Sidebar";
import Topbar from "./global/Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [theme, colorMode] = useMode();

  return (
    <html lang="en">
      <head>
        <title>Admin Panel</title>
      </head>
      <body>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ display: "flex", height: "100vh" }}>
          {/* Sidebar */}
          <Sidebar />
          {/* Main Content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Topbar />
            {/* Page Content */}
            <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
              {children}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </body>
    </html>
  );
}
