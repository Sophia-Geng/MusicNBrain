"use client";

import { useState } from "react";
import { mockStudentPerformances } from "@/lib/mock-data";

export default function StudentSchedulePage() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Hi, Emma! 👋</h2>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid #e5e7eb" }}>
        {[
          { key: "upcoming" as const, label: "📋 Upcoming", count: mockStudentPerformances.upcoming.length },
          { key: "completed" as const, label: "📁 Completed", count: mockStudentPerformances.completed.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "8px 20px",
              background: "none",
              border: "none",
              borderBottom: tab === t.key ? "2px solid #2563eb" : "2px solid transparent",
              color: tab === t.key ? "#2563eb" : "#6b7280",
              fontWeight: tab === t.key ? 600 : 400,
              fontSize: 14,
              cursor: "pointer",
              marginBottom: -2,
            }}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Upcoming Tab */}
      {tab === "upcoming" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mockStudentPerformances.upcoming.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No upcoming performances</div>
          ) : (
            mockStudentPerformances.upcoming.map((p) => (
              <div key={p.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>🎵 {p.concert_title}</div>
                    <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "2px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 600 }}>
                      {p.type === "ONLINE" ? "🌐 Online" : "📍 Offline"}
                    </span>
                  </div>
                  <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
                    Upcoming
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13, color: "#374151", marginBottom: 12 }}>
                  <div><span style={{ color: "#9ca3af" }}>Piece:</span> {p.piece}</div>
                  <div><span style={{ color: "#9ca3af" }}>Time:</span> {p.slot}</div>
                  <div><span style={{ color: "#9ca3af" }}>Duration:</span> {p.duration} min</div>
                  <div><span style={{ color: "#9ca3af" }}>Order:</span> #{p.order} of {p.total_performers}</div>
                </div>

                {/* Online */}
                {p.type === "ONLINE" && (
                  <div style={{ background: "#eff6ff", borderRadius: 6, padding: 12 }}>
                    <div style={{ fontSize: 13, color: "#1e40af", marginBottom: 8 }}>You are performer #{p.order} — wait for your turn</div>
                    <button style={{ padding: "8px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                      Join Zoom 🔗
                    </button>
                  </div>
                )}

                {/* Offline */}
                {p.type === "OFFLINE" && (
                  <div style={{ background: "#f0fdf4", borderRadius: 6, padding: 12 }}>
                    <div style={{ fontSize: 13, marginBottom: 4 }}><strong>Venue:</strong> {p.venue_name}</div>
                    <div style={{ fontSize: 13, marginBottom: 4 }}><strong>Address:</strong> {p.venue_address}</div>
                    <div style={{ fontSize: 13, color: "#9ca3af" }}>Please arrive 30 minutes early</div>
                    <button style={{ marginTop: 8, padding: "6px 16px", background: "white", border: "1px solid #16a34a", color: "#16a34a", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
                      View Map 📍
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Completed Tab */}
      {tab === "completed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mockStudentPerformances.completed.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No completed performances yet</div>
          ) : (
            mockStudentPerformances.completed.map((p) => (
              <div key={p.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>🎵 {p.concert_title}</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>
                      {new Date(p.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <span style={{ background: "#d1fae5", color: "#065f46", padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
                    Completed
                  </span>
                </div>

                <div style={{ fontSize: 13, color: "#374151", marginBottom: 12 }}>
                  <span style={{ color: "#9ca3af" }}>Piece:</span> {p.piece} · <span style={{ color: "#9ca3af" }}>Duration:</span> {p.duration} min
                </div>

                {/* AI Feedback */}
                {p.feedback && (
                  <div style={{ background: "#fefce8", borderRadius: 6, padding: 12, marginBottom: 12, border: "1px solid #fde68a" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>💬 AI Feedback:</div>
                    <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{p.feedback}</div>
                  </div>
                )}

                {/* Video */}
                {p.video_url && (
                  <button style={{ padding: "6px 16px", background: "white", border: "1px solid #2563eb", color: "#2563eb", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
                    Watch Recording ▶️
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
