"use client";

import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Navbar from "@/components/Navbar";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const hiddenRoutes = ["/landing"];
    const pathname = usePathname();
    const shouldShowHeaderAndNavbar = !hiddenRoutes.includes(pathname);

    return (
        <html lang="en">
            <head>
                <Script
                    src="https://upload-widget.cloudinary.com/global/all.js"
                    strategy="beforeInteractive" // Ensures the script is loaded before rendering
                />
            </head>
            <body className={`${inter.className} m-0 p-0`}>
            {shouldShowHeaderAndNavbar ? (
                <div className="min-h-screen bg-gray-50 flex flex-col z-50">
                    {/* Header */}
                    <Header
                        onMenuClick={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                        totalEarnings={0}
                    />

                    {/* Navbar */}
                    <Navbar open={true} />

                    <div className="flex flex-1">
                        <main className="flex-1 m-0 p-0 transition-all duration-300">
                            {children}
                        </main>
                    </div>
                </div>
            ) : (
                <div className="flex flex-1">
                    <main className="flex-1 m-0 p-0 transition-all duration-300">
                        {children}
                    </main>
                </div>
            )}
            <Toaster />
        </body>
    </html >
  );
}