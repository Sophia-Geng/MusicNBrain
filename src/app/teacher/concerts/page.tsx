// Copyright (c) 2025 MusicNBrain Media Lab. All Rights Reserved.
// Unauthorized use, copying, or distribution is prohibited.
// Contact: developer@musicnbrain.org

"use client";

import { useState } from "react";
import Link from "next/link";
import { mockConcerts, mockStudentMessages } from "@/lib/mock-data";
import { ConcertStatus } from "@/types";

const NOW = new Date();

function isPast(dateStr: string) {
  return new Date(dateStr) < NOW;
}

/* Badge */
function ConcertBadge({ status, past }: { status: ConcertStatus; past?: boolean }) {
  if (past) {
    return (
      <span style={{ background: "#f3f4f6", color: "#6b7280", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
        Completed
      </span>
    );
  }
  const config: Record<string, { bg: string; color: string; label: string }> = {
    DRAFT: { bg: "#f3f4f6", color: "#374151", label: "Draft" },
    PARSING: { bg: "#dbeafe", color: "#1d4ed8", label: "Processing..." },
    REVIEWING: { bg: "#fef3c7", color: "#92400e", label: "Ready to Review" },
    PUBLISHED: { bg: "#d1fae5", color: "#065f46", label: "Published" },
  };
  const s = config[status] || config.DRAFT;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

type Tab = "in_progress" | "upcoming" | "past";

export default function TeacherConcertsPage() {
  const [tab, setTab] = useState<Tab>("in_progress");

  const inProgress = mockConcerts.filter(
    (c) => c.status === "DRAFT" || c.status === "PARSING" || c.status === "REVIEWING"
  );
  const upcoming = mockConcerts.filter(
    (c) => c.status === "PUBLISHED" && !isPast(c.start_time)
  );
  const past = mockConcerts.filter(
    (c) => c.status === "PUBLISHED" && isPast(c.start_time)
  );

  const getHref = (c: typeof mockConcerts[0]) => {
    if (c.status === "DRAFT") return `/teacher/create?draft=${c.id}`;
    if (c.status === "REVIEWING") return `/teacher/review/${c.id}`;
    if (c.status === "PUBLISHED") return `/teacher/concert/${c.id}`;
    return "#";
  };

  const getActionLabel = (c: typeof mockConcerts[0]) => {
    if (c.status === "DRAFT") return "Continue editing →";
    if (c.status === "REVIEWING") return "Review AI results →";
    if (c.status === "PUBLISHED" && !isPast(c.start_time)) return "View & Edit →";
    if (c.status === "PUBLISHED" && isPast(c.start_time)) return "View results →";
    return "";
  };

  const tabs: { key: Tab; emoji: string; label: string; count: number; description: string }[] = [
    { key: "in_progress", emoji: "📝", label: "In Progress", count: inProgress.length, description: "Not yet published" },
    { key: "upcoming", emoji: "📅", label: "Upcoming", count: upcoming.length, description: "Published, not yet performed" },
    { key: "past", emoji: "✅", label: "Past", count: past.length, description: "Already performed" },
  ];

  const concerts = tab === "in_progress" ? inProgress : tab === "upcoming" ? upcoming : past;
  const isPastTab = tab === "past";

  const emptyMessages: Record<Tab, string> = {
    in_progress: "No concerts in progress. Create one!",
    upcoming: "No upcoming concerts.",
    past: "No past concerts yet.",
  };

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
            padding: "10px 24px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          + New Concert
        </Link>
      </div>

      {/* 3 Tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 20,
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        {tabs.map((t) => (
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
            {t.emoji} {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Tab description */}
      <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
        {tabs.find((t) => t.key === tab)?.description}
      </div>

      {/* Concert list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {concerts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 15 }}>
            {emptyMessages[tab]}
          </div>
        ) : (
          concerts.map((c) => (
            <Link
              key={c.id}
              href={getHref(c)}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 20,
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#93c5fd")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 17 }}>{c.title}</span>
                      <ConcertBadge status={c.status} past={isPastTab} />
                    </div>
                    <div style={{ fontSize: 14, color: "#6b7280" }}>
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
                    {/* Extra info for past concerts */}
                    {isPastTab && c.audience_count && (
                      <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
                        👥 {c.audience_count} attendees
                        {c.recording_url && " · 🎥 Recording available"}
                      </div>
                    )}
                    {/* Upcoming hint */}
                    {tab === "upcoming" && (
                      <div style={{ fontSize: 13, color: "#16a34a", marginTop: 4 }}>
                        📬 Students notified · You can still make changes
                        {(() => {
                          const unread = mockStudentMessages.filter((m) => m.concert_id === c.id && !m.read).length;
                          return unread > 0 ? (
                            <span style={{ marginLeft: 8, background: "#ef4444", color: "white", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
                              💬 {unread} new message{unread > 1 ? "s" : ""}
                            </span>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 14, color: "#2563eb", fontWeight: 500, whiteSpace: "nowrap" }}>
                    {getActionLabel(c)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
