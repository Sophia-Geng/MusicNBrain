// Copyright (c) 2025 MusicNBrain Media Lab. All Rights Reserved.
// Unauthorized use, copying, or distribution is prohibited.
// Contact: developer@musicnbrain.org

import type { Metadata } from "next";
import { NavBar } from "@/components/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: "MusicNBrain - Concert Management",
  description: "Concert management system for music teachers and students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#f8fafc",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <NavBar />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 40px 24px" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
