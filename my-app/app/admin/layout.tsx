"use client";

import React from "react";
import Sidebar from "@/app/admin/components/sidebar/page"; // Adjust path based on your structure
import Topbar from "@/app/admin/components/topbar/page";
import "@/app/admin/page.css"; // Add any global admin styles here
import { Provider } from "react-redux";
import { store, persistor } from "@/app/admin/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
            <Topbar />
            <div className="admin-layout">
              <Sidebar />
              <main className="admin-content">{children}</main>
            </div>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
