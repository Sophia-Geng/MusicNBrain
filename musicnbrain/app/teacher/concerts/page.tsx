"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/shared";
import { mockConcerts } from "@/lib/mock-data";

export default function TeacherConcertsPage() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>My Concerts</h2>
        <Link
          href="/teacher/create"
          style={{
            padding: "8px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          + Create New Concert
        </Link>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mockConcerts.map((c) => (
          <Link
            key={c.id}
            href={c.status === "REVIEWING" ? `/teacher/review/${c.id}` : "#"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 16,
                cursor: c.status === "REVIEWING" ? "pointer" : "default",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{c.title}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>
                    {c.type === "ONLINE" ? "🌐 Online (Zoom)" : `📍 ${c.venue_name}`}
                    {" · "}
                    {new Date(c.start_time).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}
                    {c.duration} min
                  </div>
                </div>
                {c.status === "REVIEWING" && (
                  <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>
                    Review →
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
