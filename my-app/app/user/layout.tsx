"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} flex`}>
        {/* Sidebar */}
        {shouldShowSidebar && (
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        )}

        {/* Main Content with Header */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <Header
            onMenuClick={toggleSidebar} // Pass the toggleSidebar function for the hamburger menu
            totalEarnings={0} // Replace this with actual data if available
          />

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>

        <Toaster />
      </body>
    </html>
  );
}
