"use client"; // Ensures this layout runs only on the client

import React from "react";
import "@/app/certificate/certificate.css"; // Import styles for the certificate section

export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="certificate-layout">
      <header className="certificate-header">
        <h1>Certification Process</h1>
      </header>
      <main className="certificate-content">{children}</main>
      <footer className="certificate-footer">
        <p>&copy; 2024 WasteZero Organization. All rights reserved.</p>
      </footer>
    </div>
  );
}
