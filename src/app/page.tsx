// Copyright (c) 2025 MusicNBrain Media Lab. All Rights Reserved.
// Unauthorized use, copying, or distribution is prohibited.
// Contact: developer@musicnbrain.org

import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 24,
        background: "#f8fafc",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ fontSize: 48 }}>🎵</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: 0 }}>
        MusicNBrain
      </h1>
      <p style={{ color: "#6b7280", margin: 0 }}>Concert Management System</p>
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <Link
          href="/teacher/concerts"
          style={{
            padding: "12px 32px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Teacher Login
        </Link>
        <Link
          href="/student/schedule"
          style={{
            padding: "12px 32px",
            background: "white",
            color: "#2563eb",
            border: "2px solid #2563eb",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Student Login
        </Link>
      </div>
    </div>
  );
}
