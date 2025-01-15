"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const hiddenRoutes = ["/admin/certificate-reviews", "/admin"];
  const shouldShowSidebar = !hiddenRoutes.includes(pathname);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <head>
        <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="beforeInteractive" />
      </head>
      <body className="flex">
        {/* Sidebar */}
        {shouldShowSidebar && <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header onMenuClick={toggleSidebar} totalEarnings={0} />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>

        <Toaster />
      </body>
    </html>
  );
}
