// Copyright (c) 2025 MusicNBrain Media Lab. All Rights Reserved.
// Unauthorized use, copying, or distribution is prohibited.
// Contact: developer@musicnbrain.org

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  mockConcerts,
  mockPublishedPerformances,
  mockUpcomingPerformances,
  mockConcertReview,
  mockStudentMessages,
} from "@/lib/mock-data";
import { Performance, Concert, StudentMessage } from "@/types";

const NOW = new Date();
function isPast(dateStr: string) {
  return new Date(dateStr) < NOW;
}

/* ─── Score helpers ─── */
function scoreColor(score: number) {
  if (score >= 9) return { bg: "#d1fae5", color: "#065f46" };
  if (score >= 8) return { bg: "#dbeafe", color: "#1d4ed8" };
  if (score >= 7) return { bg: "#fef9c3", color: "#92400e" };
  return { bg: "#fee2e2", color: "#991b1b" };
}

function ScoreBadge({ score }: { score: number }) {
  const { bg, color } = scoreColor(score);
  return (
    <span style={{ background: bg, color, padding: "4px 12px", borderRadius: 20, fontSize: 15, fontWeight: 700 }}>
      ⭐ {score.toFixed(1)}/10
    </span>
  );
}

/* ─── Past: Performer Review Card (read-only) ─── */
function PastPerformerCard({
  review,
  order,
}: {
  review: typeof mockConcertReview.performer_reviews[0];
  order: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const emoji = review.instrument === "Piano" ? "🎹" : review.instrument === "Violin" ? "🎻" : "🎵";

  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 24px" }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: expanded ? 14 : 0, cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
            #{order} {review.name}
            <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 14, marginLeft: 8 }}>{emoji} {review.instrument}</span>
          </div>
          <div style={{ fontSize: 15, color: "#374151" }}>🎵 {review.piece}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ScoreBadge score={review.score} />
          <span style={{ fontSize: 18, color: "#9ca3af" }}>{expanded ? "▾" : "▸"}</span>
        </div>
      </div>
      {expanded && (
        <div>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", marginBottom: 12, border: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>🤖 AI Review</div>
            <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{review.feedback}</div>
          </div>
          {review.video_url && (
            <button style={{ padding: "8px 18px", background: "white", border: "1px solid #2563eb", color: "#2563eb", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
              ▶ Watch Recording
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Upcoming: Performer Card (editable) ─── */
function UpcomingPerformerCard({
  perf,
  order,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: {
  perf: Performance;
  order: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updated: Performance) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<Performance>({ ...perf });
  const emoji = perf.instrument === "Piano" ? "🎹" : perf.instrument === "Violin" ? "🎻" : "🎵";

  const fieldStyle = { width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 15, boxSizing: "border-box" as const, outline: "none" };
  const labelStyle = { display: "block", fontSize: 14, fontWeight: 600 as const, marginBottom: 6, color: "#374151" };

  if (isEditing) {
    return (
      <div style={{ background: "#fefce8", border: "2px solid #fbbf24", borderRadius: 12, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#92400e" }}>✏️ Editing #{order}</div>
          <button onClick={onDelete} style={{ background: "none", border: "1px solid #fca5a5", borderRadius: 6, padding: "4px 10px", fontSize: 13, color: "#ef4444", cursor: "pointer" }}>
            🗑 Remove
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>👤 Name</label>
              <input type="text" value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>🎹 Instrument</label>
              <input type="text" value={draft.instrument} onChange={(e) => setDraft((p) => ({ ...p, instrument: e.target.value }))} style={fieldStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>🎵 Piece</label>
            <input type="text" value={draft.piece} onChange={(e) => setDraft((p) => ({ ...p, piece: e.target.value }))} style={fieldStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>⏱ Duration</label>
              <input type="number" value={draft.duration || ""} onChange={(e) => setDraft((p) => ({ ...p, duration: parseInt(e.target.value) || 0 }))} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>📊 Grade</label>
              <input type="text" value={draft.grade} onChange={(e) => setDraft((p) => ({ ...p, grade: e.target.value }))} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>📧 Email</label>
              <input type="email" value={draft.email} onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))} style={fieldStyle} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
          <button onClick={onCancel} style={{ padding: "10px 24px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, cursor: "pointer", color: "#6b7280" }}>Cancel</button>
          <button onClick={() => onSave(draft)} style={{ padding: "10px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>✅ Save</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
            #{order} {perf.name}
            <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 14, marginLeft: 8 }}>{emoji} {perf.instrument}</span>
          </div>
          <div style={{ fontSize: 15, color: "#374151", marginBottom: 4 }}>🎵 {perf.piece}</div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>
            ⏱ {perf.duration} min
            {perf.grade && <span style={{ marginLeft: 12 }}>📊 Grade {perf.grade}</span>}
            {perf.email && <span style={{ marginLeft: 12 }}>📧 {perf.email}</span>}
          </div>
        </div>
        <button onClick={onEdit} style={{ padding: "8px 18px", background: "#f3f4f6", border: "1px solid #d1d5db", color: "#374151", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
          ✏️ Edit
        </button>
      </div>
    </div>
  );
}

/* ─── Notify Modal ─── */
function NotifyModal({ onNotify, onSkip }: { onNotify: () => void; onSkip: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "white", borderRadius: 16, padding: 28, width: 400, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0" }}>Changes Saved!</h3>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 24px 0", lineHeight: 1.6 }}>
          Would you like to notify students about the changes?
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onSkip} style={{ flex: 1, padding: "12px 0", background: "white", border: "1px solid #d1d5db", borderRadius: 10, fontSize: 15, cursor: "pointer", color: "#6b7280" }}>No, skip</button>
          <button onClick={onNotify} style={{ flex: 1, padding: "12px 0", background: "#2563eb", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Yes, notify them</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Social Media Modal ─── */
function SocialMediaModal({
  concert,
  performances,
  onClose,
}: {
  concert: Concert;
  performances: Performance[];
  onClose: () => void;
}) {
  const [step, setStep] = useState<"select" | "preview">("select");
  const [selectedPlatforms, setSelectedPlatforms] = useState({ tiktok: false, xiaohongshu: false });
  const anySelected = selectedPlatforms.tiktok || selectedPlatforms.xiaohongshu;

  const generatedCaption = `🎵 ${concert.title} 🌟\n📅 ${new Date(concert.start_time).toLocaleDateString("en-US", { month: "long", day: "numeric" })}\n📍 ${concert.type === "ONLINE" ? "Zoom Online Live" : concert.venue_name}\n\n✨ Program ✨\n${performances.map((p) => `${p.instrument === "Piano" ? "🎹" : p.instrument === "Violin" ? "🎻" : "🎵"} ${p.name} - ${p.piece}`).join("\n")}\n\n🎶 Come join us!`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "white", borderRadius: 16, padding: 28, width: 460, maxHeight: "80vh", overflow: "auto" }}>
        {step === "select" ? (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px 0" }}>📱 Share on Social Media</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "12px 16px", border: selectedPlatforms.tiktok ? "2px solid #2563eb" : "1px solid #e5e7eb", borderRadius: 12, background: selectedPlatforms.tiktok ? "#eff6ff" : "white" }}>
                <input type="checkbox" checked={selectedPlatforms.tiktok} onChange={() => setSelectedPlatforms((p) => ({ ...p, tiktok: !p.tiktok }))} style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: 22 }}>🎵</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>TikTok</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "12px 16px", border: selectedPlatforms.xiaohongshu ? "2px solid #2563eb" : "1px solid #e5e7eb", borderRadius: 12, background: selectedPlatforms.xiaohongshu ? "#eff6ff" : "white" }}>
                <input type="checkbox" checked={selectedPlatforms.xiaohongshu} onChange={() => setSelectedPlatforms((p) => ({ ...p, xiaohongshu: !p.xiaohongshu }))} style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: 22 }}>📕</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Xiaohongshu (小红书)</span>
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={onClose} style={{ padding: "10px 24px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => setStep("preview")} disabled={!anySelected} style={{ padding: "10px 24px", background: anySelected ? "#2563eb" : "#9ca3af", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: anySelected ? "pointer" : "not-allowed" }}>Generate Preview</button>
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px 0" }}>{selectedPlatforms.tiktok ? "Post to TikTok" : "Post to Xiaohongshu"}</h3>
            <div style={{ background: "#eff6ff", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#1e40af", marginBottom: 20 }}>ℹ️ Review the auto-generated caption below. Edit if needed.</div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Caption</label>
              <textarea rows={8} defaultValue={generatedCaption} style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Tags</label>
              <input type="text" defaultValue="#MusicRecital #Piano #Violin #Spring2026" style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setStep("select")} style={{ padding: "10px 24px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>← Back</button>
              <button onClick={onClose} style={{ padding: "10px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>📋 Copy & Open {selectedPlatforms.tiktok ? "TikTok" : "Xiaohongshu"} →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Concert Info Edit Modal ─── */
function ConcertEditModal({ concert, onSave, onCancel }: { concert: Concert; onSave: (u: Partial<Concert>) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState({
    title: concert.title,
    type: concert.type,
    start_time: concert.start_time.slice(0, 16),
    duration: concert.duration,
    venue_name: concert.venue_name,
    venue_address: concert.venue_address,
  });
  const fieldStyle = { width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 15, boxSizing: "border-box" as const };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "white", borderRadius: 16, padding: 28, width: 480, maxHeight: "85vh", overflow: "auto" }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px 0" }}>✏️ Edit Concert Info</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Title</label>
            <input type="text" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} style={fieldStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Start Time</label>
              <input type="datetime-local" value={draft.start_time} onChange={(e) => setDraft((p) => ({ ...p, start_time: e.target.value }))} style={fieldStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Duration</label>
              <div style={{ position: "relative" }}>
                <input type="number" value={draft.duration || ""} onChange={(e) => setDraft((p) => ({ ...p, duration: parseInt(e.target.value) || 0 }))} min={30} step={30} style={{ ...fieldStyle, paddingRight: 70 }} />
                <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#9ca3af", pointerEvents: "none" }}>min</span>
              </div>
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#374151" }}>Venue</label>
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <button onClick={() => setDraft((p) => ({ ...p, type: "OFFLINE" }))} style={{ flex: 1, padding: "10px 0", border: draft.type === "OFFLINE" ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 10, background: draft.type === "OFFLINE" ? "#eff6ff" : "white", color: draft.type === "OFFLINE" ? "#2563eb" : "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>📍 In-Person</button>
              <button onClick={() => setDraft((p) => ({ ...p, type: "ONLINE" }))} style={{ flex: 1, padding: "10px 0", border: draft.type === "ONLINE" ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 10, background: draft.type === "ONLINE" ? "#eff6ff" : "white", color: draft.type === "ONLINE" ? "#2563eb" : "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>🌐 Online</button>
            </div>
            {draft.type === "OFFLINE" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input type="text" value={draft.venue_name} onChange={(e) => setDraft((p) => ({ ...p, venue_name: e.target.value }))} placeholder="Venue name" style={fieldStyle} />
                <input type="text" value={draft.venue_address} onChange={(e) => setDraft((p) => ({ ...p, venue_address: e.target.value }))} placeholder="Address" style={fieldStyle} />
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button onClick={onCancel} style={{ padding: "10px 24px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, cursor: "pointer", color: "#6b7280" }}>Cancel</button>
          <button onClick={() => onSave(draft)} style={{ padding: "10px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>✅ Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function ConcertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const concertId = params.id as string;

  const foundConcert = mockConcerts.find((c) => c.id === concertId) || mockConcerts.find((c) => c.status === "PUBLISHED")!;
  const [concert, setConcert] = useState<Concert>(foundConcert);
  const concertIsPast = isPast(concert.start_time);

  // Load correct performances based on concert
  const initialPerfs = concert.id === "3" ? mockPublishedPerformances : concert.id === "4" ? mockUpcomingPerformances : mockPublishedPerformances;
  const [performances, setPerformances] = useState<Performance[]>(initialPerfs);
  const review = concertIsPast ? mockConcertReview : null;

  const [editingPerfId, setEditingPerfId] = useState<string | null>(null);
  const [showConcertEdit, setShowConcertEdit] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);

  // Messages
  const [messages, setMessages] = useState<StudentMessage[]>(
    mockStudentMessages.filter((m) => m.concert_id === concert.id)
  );
  const unreadCount = messages.filter((m) => !m.read).length;

  const markAsRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const markAllRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  };

  const totalMinutes = performances.reduce((s, p) => s + p.duration, 0);

  const handleConcertSave = (updated: Partial<Concert>) => {
    setConcert((prev) => ({ ...prev, ...updated }));
    setShowConcertEdit(false);
    setShowNotifyModal(true);
  };

  const handlePerfSave = (updated: Performance) => {
    setPerformances((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPerfId(null);
    setShowNotifyModal(true);
  };

  const handlePerfDelete = (id: string) => {
    setPerformances((prev) => prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i + 1 })));
    setEditingPerfId(null);
    setShowNotifyModal(true);
  };

  const handleAddPerformer = () => {
    const newId = String(Date.now());
    setPerformances((prev) => [
      ...prev,
      { id: newId, concert_id: concert.id, order: prev.length + 1, name: "", piece: "", instrument: "", grade: "", email: "", slot: "", duration: 0, confidence: "high" as const },
    ]);
    setEditingPerfId(newId);
  };

  /* ═══ PAST CONCERT VIEW (read-only + AI reviews) ═══ */
  if (concertIsPast) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Link href="/teacher/concerts" style={{ color: "#2563eb", fontSize: 14, marginBottom: 16, display: "inline-block", textDecoration: "none" }}>
          ← Back to Concerts
        </Link>

        {/* Header */}
        <div style={{ background: "white", borderRadius: 16, padding: "32px 28px 24px", textAlign: "center", marginBottom: 24, border: "1px solid #e5e7eb" }}>
          <span style={{ background: "#f3f4f6", color: "#6b7280", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>✅ Completed</span>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "12px 0 8px 0" }}>{concert.title}</h1>
          <div style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.8 }}>
            📅 {new Date(concert.start_time).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            <br />
            {concert.type === "ONLINE" ? (
              "🌐 Online (Zoom)"
            ) : (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(concert.venue_address || concert.venue_name)}`}
                target="_blank"
                style={{ color: "#2563eb", textDecoration: "underline" }}
              >
                📍 {concert.venue_name}
              </a>
            )}
            {" · "}{concert.duration} min
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: "white", borderRadius: 14, padding: "20px 24px", marginBottom: 24, border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#111827" }}>📊 Concert Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { value: performances.length, label: "Performers" },
              { value: concert.audience_count || "—", label: "Attendees" },
              { value: totalMinutes, label: "Minutes" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {review && (
            <>
              <div style={{ background: "#eff6ff", borderRadius: 12, padding: "16px 20px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1e40af" }}>🤖 Overall AI Score</span>
                  <ScoreBadge score={review.overall_score} />
                </div>
                <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{review.overall_feedback}</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>🌟 Highlights</div>
                {review.highlights.map((h, i) => (
                  <div key={i} style={{ fontSize: 14, color: "#374151", padding: "6px 0", borderBottom: i < review.highlights.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    • {h}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Individual reviews */}
        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 14 }}>🎵 Individual Performances</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {review?.performer_reviews.map((r, i) => (
            <PastPerformerCard key={r.performance_id} review={r} order={i + 1} />
          ))}
        </div>

        {/* Links */}
        {(concert.recording_url || concert.zoom_url) && (
          <div style={{ background: "white", borderRadius: 12, padding: "16px 20px", marginBottom: 16, border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 10 }}>🔗 Links</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {concert.zoom_url && <div style={{ fontSize: 14, color: "#374151" }}>🌐 Zoom: <a href={concert.zoom_url} style={{ color: "#2563eb" }} target="_blank">{concert.zoom_url}</a></div>}
              {concert.recording_url && <div style={{ fontSize: 14, color: "#374151" }}>🎥 Full Recording: <a href={concert.recording_url} style={{ color: "#2563eb" }} target="_blank">Watch full concert</a></div>}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginBottom: 40 }}>
          <button onClick={() => setShowSocialModal(true)} style={{ padding: "14px 20px", background: "white", border: "1px solid #8b5cf6", color: "#8b5cf6", borderRadius: 12, fontSize: 15, cursor: "pointer", fontWeight: 600 }}>📱 Share Results</button>
          <button onClick={() => router.push(`/teacher/concert/${concertId}/program`)} style={{ flex: 1, padding: "14px 0", background: "white", border: "1px solid #d1d5db", borderRadius: 12, fontSize: 15, cursor: "pointer", fontWeight: 600, color: "#374151" }}>📄 Export Program</button>
        </div>

        {showSocialModal && <SocialMediaModal concert={concert} performances={performances} onClose={() => setShowSocialModal(false)} />}
      </div>
    );
  }

  /* ═══ UPCOMING CONCERT VIEW (editable) ═══ */
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <Link href="/teacher/concerts" style={{ color: "#2563eb", fontSize: 14, marginBottom: 16, display: "inline-block", textDecoration: "none" }}>
        ← Back to Concerts
      </Link>

      {/* Header */}
      <div style={{ background: "white", borderRadius: 16, padding: "32px 28px 24px", textAlign: "center", marginBottom: 24, border: "1px solid #e5e7eb", position: "relative" }}>
        <button
          onClick={() => setShowConcertEdit(true)}
          style={{ position: "absolute", top: 16, right: 16, padding: "6px 14px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#374151", fontWeight: 500 }}
        >
          ✏️ Edit
        </button>

        <span style={{ background: "#d1fae5", color: "#065f46", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>📅 Upcoming</span>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "12px 0 8px 0" }}>{concert.title}</h1>
        <div style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.8 }}>
          📅 {new Date(concert.start_time).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          {" · "}
          {new Date(concert.start_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          <br />
          {concert.type === "ONLINE" ? (
            "🌐 Online (Zoom)"
          ) : (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(concert.venue_address || concert.venue_name)}`}
              target="_blank"
              style={{ color: "#2563eb", textDecoration: "underline" }}
            >
              📍 {concert.venue_name}, {concert.venue_address}
            </a>
          )}
          {" · "}
          {concert.duration} min
        </div>
        <div style={{ marginTop: 14, padding: "8px 16px", background: "#d1fae5", borderRadius: 10, fontSize: 14, color: "#065f46", display: "inline-block" }}>
          📬 Students have been notified · You can still make changes
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{performances.length}</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Performers</div>
        </div>
        <div style={{ background: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{totalMinutes}</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Minutes total</div>
        </div>
      </div>

      {/* Performers */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>🎵 Program</div>
        <button onClick={handleAddPerformer} style={{ padding: "6px 14px", background: "white", border: "1px solid #2563eb", color: "#2563eb", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>+ Add</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
        {performances.map((perf, i) => (
          <UpcomingPerformerCard
            key={perf.id}
            perf={perf}
            order={i + 1}
            isEditing={editingPerfId === perf.id}
            onEdit={() => setEditingPerfId(perf.id)}
            onSave={handlePerfSave}
            onCancel={() => setEditingPerfId(null)}
            onDelete={() => handlePerfDelete(perf.id)}
          />
        ))}
      </div>

      {/* Student Messages */}
      {messages.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
              💬 Student Messages
              {unreadCount > 0 && (
                <span
                  style={{
                    background: "#ef4444",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 10,
                    marginLeft: 8,
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontSize: 13,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  background: msg.read ? "white" : "#eff6ff",
                  border: msg.read ? "1px solid #e5e7eb" : "2px solid #93c5fd",
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
                    👤 {msg.student_name}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "#9ca3af" }}>
                      {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    {!msg.read && (
                      <button
                        onClick={() => markAsRead(msg.id)}
                        style={{
                          background: "none",
                          border: "1px solid #d1d5db",
                          borderRadius: 6,
                          padding: "2px 8px",
                          fontSize: 12,
                          cursor: "pointer",
                          color: "#6b7280",
                        }}
                      >
                        ✓ Read
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div style={{ display: "flex", gap: 10, marginBottom: 40 }}>
        <button onClick={() => setShowSocialModal(true)} style={{ padding: "14px 20px", background: "white", border: "1px solid #8b5cf6", color: "#8b5cf6", borderRadius: 12, fontSize: 15, cursor: "pointer", fontWeight: 600 }}>📱 Share</button>
        <button onClick={() => router.push(`/teacher/concert/${concertId}/program`)} style={{ flex: 1, padding: "14px 0", background: "white", border: "1px solid #d1d5db", borderRadius: 12, fontSize: 15, cursor: "pointer", fontWeight: 600, color: "#374151" }}>📄 Export Program</button>
      </div>

      {/* Modals */}
      {showConcertEdit && <ConcertEditModal concert={concert} onSave={handleConcertSave} onCancel={() => setShowConcertEdit(false)} />}
      {showNotifyModal && <NotifyModal onNotify={() => setShowNotifyModal(false)} onSkip={() => setShowNotifyModal(false)} />}
      {showSocialModal && <SocialMediaModal concert={concert} performances={performances} onClose={() => setShowSocialModal(false)} />}
    </div>
  );
}
