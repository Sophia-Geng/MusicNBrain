// Copyright (c) 2025 MusicNBrain Media Lab. All Rights Reserved.
// Unauthorized use, copying, or distribution is prohibited.
// Contact: developer@musicnbrain.org

"use client";

import { useState } from "react";
import { mockStudentPerformances } from "@/lib/mock-data";

export default function StudentSchedulePage() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");
  const [messageOpen, setMessageOpen] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sentMessages, setSentMessages] = useState<Record<string, string[]>>({});

  const handleSend = (perfId: string) => {
    if (!messageText.trim()) return;
    setSentMessages((prev) => ({
      ...prev,
      [perfId]: [...(prev[perfId] || []), messageText.trim()],
    }));
    setMessageText("");
    setMessageOpen(null);
  };

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
              padding: "10px 20px",
              background: "none",
              border: "none",
              borderBottom: tab === t.key ? "2px solid #2563eb" : "2px solid transparent",
              color: tab === t.key ? "#2563eb" : "#6b7280",
              fontWeight: tab === t.key ? 600 : 400,
              fontSize: 15,
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
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mockStudentPerformances.upcoming.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No upcoming performances</div>
          ) : (
            mockStudentPerformances.upcoming.map((p) => (
              <div key={p.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>🎵 {p.concert_title}</div>
                    <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
                      {p.type === "ONLINE" ? "🌐 Online" : "📍 Offline"}
                    </span>
                  </div>
                  <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
                    Upcoming
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 14, color: "#374151", marginBottom: 14 }}>
                  <div><span style={{ color: "#9ca3af" }}>Piece:</span> {p.piece}</div>
                  <div>
                    <span style={{ color: "#9ca3af" }}>Date:</span>{" "}
                    {new Date(p.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <div><span style={{ color: "#9ca3af" }}>Your Time:</span> {p.slot}</div>
                  <div><span style={{ color: "#9ca3af" }}>Duration:</span> {p.duration} min</div>
                  <div><span style={{ color: "#9ca3af" }}>Order:</span> #{p.order} of {p.total_performers}</div>
                </div>

                {/* Online */}
                {p.type === "ONLINE" && (
                  <div style={{ background: "#eff6ff", borderRadius: 8, padding: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: 14, color: "#1e40af", marginBottom: 8 }}>You are performer #{p.order} — wait for your turn</div>
                    <button style={{ padding: "10px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                      Join Zoom 🔗
                    </button>
                  </div>
                )}

                {/* Offline */}
                {p.type === "OFFLINE" && (
                  <div style={{ background: "#f0fdf4", borderRadius: 8, padding: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: 14, marginBottom: 4 }}><strong>Venue:</strong> {p.venue_name}</div>
                    <div style={{ fontSize: 14, marginBottom: 4 }}><strong>Address:</strong> {p.venue_address}</div>
                    <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 10 }}>Please arrive 30 minutes early</div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.venue_address)}`}
                      target="_blank"
                      style={{
                        display: "inline-block",
                        padding: "8px 18px",
                        background: "white",
                        border: "1px solid #16a34a",
                        color: "#16a34a",
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 500,
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      📍 Open in Maps
                    </a>
                  </div>
                )}

                {/* Sent messages */}
                {sentMessages[p.id] && sentMessages[p.id].length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    {sentMessages[p.id].map((msg, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: 8,
                          padding: "10px 14px",
                          fontSize: 14,
                          color: "#065f46",
                          marginBottom: 6,
                        }}
                      >
                        ✅ You sent: &quot;{msg}&quot;
                      </div>
                    ))}
                  </div>
                )}

                {/* Message to teacher */}
                {messageOpen === p.id ? (
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14, border: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                      💬 Message to Teacher
                    </div>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="e.g., My piece name is wrong, it should be..."
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        fontSize: 15,
                        resize: "vertical",
                        boxSizing: "border-box",
                        marginBottom: 10,
                      }}
                      autoFocus
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <button
                        onClick={() => { setMessageOpen(null); setMessageText(""); }}
                        style={{ padding: "8px 18px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, cursor: "pointer", color: "#6b7280" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSend(p.id)}
                        disabled={!messageText.trim()}
                        style={{
                          padding: "8px 18px",
                          background: messageText.trim() ? "#2563eb" : "#9ca3af",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: messageText.trim() ? "pointer" : "not-allowed",
                        }}
                      >
                        Send 📨
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setMessageOpen(p.id)}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      background: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: 8,
                      fontSize: 14,
                      cursor: "pointer",
                      color: "#6b7280",
                    }}
                  >
                    💬 Something wrong? Message your teacher
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Completed Tab */}
      {tab === "completed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mockStudentPerformances.completed.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No completed performances yet</div>
          ) : (
            mockStudentPerformances.completed.map((p) => (
              <div key={p.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>🎵 {p.concert_title}</div>
                    <div style={{ fontSize: 14, color: "#6b7280" }}>
                      {new Date(p.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <span style={{ background: "#d1fae5", color: "#065f46", padding: "2px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
                    Completed
                  </span>
                </div>

                <div style={{ fontSize: 14, color: "#374151", marginBottom: 14 }}>
                  <span style={{ color: "#9ca3af" }}>Piece:</span> {p.piece} · <span style={{ color: "#9ca3af" }}>Duration:</span> {p.duration} min
                </div>

                {/* AI Feedback */}
                {p.feedback && (
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14, marginBottom: 14, border: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>🤖 AI Feedback</div>
                    <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{p.feedback}</div>
                  </div>
                )}

                {/* Video */}
                {p.video_url && (
                  <button style={{ padding: "8px 18px", background: "white", border: "1px solid #2563eb", color: "#2563eb", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
                    ▶ Watch Recording
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
