// app/layout.tsx

import "./globals.css";
import React from "react";

export const metadata = {
  title: "Waste Management Dashboard",
  description: "Explore our initiatives to improve sustainability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="text-white text-center">
          <div className="bg-red-600 py-2 text-sm font-medium">
            6 concepts of waste zero!
          </div>
          <div className="bg-red-600">
            <div className="py-6 bg-[#006a4e]">
              <h1 className="text-2xl font-bold tracking-wide text-white font-['Ubuntu']">
                Welcome to Waste Zero Bangladesh
              </h1>
            </div>
          </div>
        </header>
        <main className="flex-grow bg-gray-100 p-6 font-['Ubuntu']">
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center py-4 mt-4 font-['Ubuntu']">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Waste Management
          </p>
        </footer>
      </body>
    </html>
  );
}
