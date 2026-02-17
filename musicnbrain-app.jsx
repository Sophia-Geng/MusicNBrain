import { useState } from "react";

/* ============================================================
   MOCK DATA
   ============================================================ */
const mockConcerts = [
  {
    id: "1",
    title: "Spring Recital 2026",
    type: "ONLINE",
    status: "REVIEWING",
    start_time: "2026-03-15T14:00:00Z",
    duration: 120,
    venue_name: "",
    venue_address: "",
    raw_input: "1. Tommy - Fur Elise, 4 min\n2. Emma Chen, piano, Chopin Nocturne Op.9 No.2, about 8 minutes\n3. Liam - violin - Bach Partita No.2, 5 min",
    raw_input_type: "TEXT",
  },
  {
    id: "2",
    title: "Summer Concert 2026",
    type: "OFFLINE",
    status: "DRAFT",
    start_time: "2026-06-20T19:00:00Z",
    duration: 90,
    venue_name: "Boston Concert Hall",
    venue_address: "123 Main St, Boston",
    raw_input: "",
    raw_input_type: "TEXT",
  },
  {
    id: "3",
    title: "Winter Concert 2025",
    type: "ONLINE",
    status: "PUBLISHED",
    start_time: "2025-12-20T14:00:00Z",
    duration: 90,
    venue_name: "",
    venue_address: "",
    raw_input: "",
    raw_input_type: "TEXT",
  },
];

const mockPerformances = [
  { id: "1", concert_id: "1", order: 1, name: "Tommy", piece: "Fur Elise", instrument: "", grade: "", email: "", slot: "14:05", duration: 4, confidence: "low" },
  { id: "2", concert_id: "1", order: 2, name: "Emma Chen", piece: "Chopin Nocturne Op.9 No.2", instrument: "Piano", grade: "8", email: "emma@gmail.com", slot: "14:10", duration: 8, confidence: "high" },
  { id: "3", concert_id: "1", order: 3, name: "Liam Rodriguez", piece: "Bach Partita No.2", instrument: "Violin", grade: "7", email: "liam@gmail.com", slot: "14:20", duration: 5, confidence: "high" },
];

const mockStudentPerformances = {
  upcoming: [
    { id: "1", concert_title: "Spring Recital 2026", type: "ONLINE", piece: "Chopin Nocturne Op.9 No.2", slot: "14:10", duration: 8, order: 2, total_performers: 3, zoom_url: "https://zoom.us/j/123456", venue_name: "", venue_address: "", start_time: "2026-03-15T14:00:00Z" },
  ],
  completed: [
    { id: "2", concert_title: "Winter Concert 2025", type: "ONLINE", piece: "Bach Partita No.2", slot: "14:30", duration: 5, feedback: "Great intonation! Rhythm could be more steady in the middle section. Beautiful tone quality throughout.", video_url: "#", start_time: "2025-12-20T14:00:00Z" },
  ],
};

/* ============================================================
   STATUS BADGE
   ============================================================ */
const StatusBadge = ({ status }) => {
  const styles = {
    DRAFT: { bg: "#f3f4f6", color: "#374151", label: "Draft" },
    PARSING: { bg: "#dbeafe", color: "#1d4ed8", label: "AI Parsing..." },
    REVIEWING: { bg: "#fef3c7", color: "#92400e", label: "Reviewing" },
    PUBLISHED: { bg: "#d1fae5", color: "#065f46", label: "Published" },
  };
  const s = styles[status] || styles.DRAFT;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
      {s.label}
    </span>
  );
};

/* ============================================================
   CONFIDENCE INDICATOR
   ============================================================ */
const ConfidenceCell = ({ value, confidence, onChange, placeholder }) => {
  const bg = confidence === "low" && !value ? "#fee2e2" : confidence === "low" ? "#fef9c3" : "white";
  const icon = confidence === "low" && !value ? "❌" : confidence === "low" ? "⚠️" : "✅";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        style={{
          background: bg,
          border: "1px solid #d1d5db",
          borderRadius: 4,
          padding: "4px 8px",
          fontSize: 13,
          width: "100%",
          outline: "none",
        }}
      />
      <span style={{ fontSize: 14 }}>{icon}</span>
    </div>
  );
};

/* ============================================================
   PAGE: HOME / LOGIN
   ============================================================ */
const HomePage = ({ onNavigate }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", gap: 24 }}>
    <div style={{ fontSize: 48 }}>🎵</div>
    <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: 0 }}>MusicNBrain</h1>
    <p style={{ color: "#6b7280", margin: 0 }}>Concert Management System</p>
    <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
      <button
        onClick={() => onNavigate("teacher-concerts")}
        style={{ padding: "12px 32px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
      >
        Teacher Login
      </button>
      <button
        onClick={() => onNavigate("student-schedule")}
        style={{ padding: "12px 32px", background: "white", color: "#2563eb", border: "2px solid #2563eb", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
      >
        Student Login
      </button>
    </div>
  </div>
);

/* ============================================================
   PAGE: TEACHER - CONCERT LIST
   ============================================================ */
const TeacherConcertList = ({ onNavigate }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>My Concerts</h2>
      <button
        onClick={() => onNavigate("teacher-create")}
        style={{ padding: "8px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
      >
        + Create New Concert
      </button>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {mockConcerts.map((c) => (
        <div
          key={c.id}
          onClick={() => c.status === "REVIEWING" ? onNavigate("teacher-review") : null}
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 16,
            cursor: c.status === "REVIEWING" ? "pointer" : "default",
            transition: "box-shadow 0.15s",
          }}
          onMouseEnter={(e) => { if (c.status === "REVIEWING") e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{c.title}</span>
                <StatusBadge status={c.status} />
              </div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                {c.type === "ONLINE" ? "🌐 Online (Zoom)" : `📍 ${c.venue_name}`}
                {" · "}
                {new Date(c.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {" · "}
                {c.duration} min
              </div>
            </div>
            {c.status === "REVIEWING" && (
              <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>Review →</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ============================================================
   PAGE: TEACHER - CREATE CONCERT
   ============================================================ */
const TeacherCreateConcert = ({ onNavigate }) => {
  const [form, setForm] = useState({
    title: "",
    type: "OFFLINE",
    start_time: "2026-03-15T14:00",
    duration: 120,
    venue_name: "",
    venue_address: "",
    raw_input: "",
  });

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const endTime = (() => {
    if (!form.start_time || !form.duration) return "";
    const d = new Date(form.start_time);
    d.setMinutes(d.getMinutes() + Number(form.duration));
    return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  })();

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <button onClick={() => onNavigate("teacher-concerts")} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0 }}>
        ← Back to Concerts
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Create New Concert</h2>

      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g., Spring Recital 2026"
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
        />
      </div>

      {/* Time Settings */}
      <div style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>—— Time Settings ——</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 8 }}>
        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Start Time</label>
          <input
            type="datetime-local"
            value={form.start_time}
            onChange={(e) => update("start_time", e.target.value)}
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Duration (minutes)</label>
          <select
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
          >
            {[60, 90, 120, 150, 180].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
      {endTime && <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>Expected end: {endTime}</div>}

      {/* Venue Settings */}
      <div style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>—— Venue Settings ——</div>
      <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
          <input type="radio" checked={form.type === "OFFLINE"} onChange={() => update("type", "OFFLINE")} />
          Offline Venue
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
          <input type="radio" checked={form.type === "ONLINE"} onChange={() => update("type", "ONLINE")} />
          Online Live (Zoom auto-generated)
        </label>
      </div>

      {form.type === "OFFLINE" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Venue Name</label>
            <input
              type="text"
              value={form.venue_name}
              onChange={(e) => update("venue_name", e.target.value)}
              placeholder="e.g., Boston Concert Hall"
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Venue Address</label>
            <input
              type="text"
              value={form.venue_address}
              onChange={(e) => update("venue_address", e.target.value)}
              placeholder="e.g., 123 Main St, Boston"
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>
        </div>
      )}

      {form.type === "ONLINE" && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: 12, marginBottom: 20, fontSize: 13, color: "#1e40af" }}>
          ℹ️ Zoom meeting link will be automatically generated when you publish this concert.
        </div>
      )}

      {/* Program List Source */}
      <div style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>—— Program List Source (Multimodal Input) ——</div>
      <div
        style={{
          border: "2px dashed #93c5fd",
          borderRadius: 8,
          padding: 24,
          textAlign: "center",
          marginBottom: 8,
          background: "#f8fafc",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>☁️</div>
        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>Drag and drop files here, paste text, or click buttons below</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 16 }}>
          <button style={{ padding: "6px 16px", background: "white", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
            📄 Upload PDF/Image/Excel
          </button>
          <button style={{ padding: "6px 16px", background: "white", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
            🔗 Input URL
          </button>
        </div>
        <textarea
          value={form.raw_input}
          onChange={(e) => update("raw_input", e.target.value)}
          placeholder="Or paste text/CSV/email content here..."
          rows={5}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, resize: "vertical", boxSizing: "border-box" }}
        />
      </div>
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24 }}>
        Supported: PDF, JPG/PNG images, CSV/Excel, Web links, plain text
      </div>

      {/* Submit */}
      <button
        onClick={() => onNavigate("teacher-review")}
        style={{ width: "100%", padding: "12px 0", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
      >
        ⚡ Submit & Start AI Analysis
      </button>
    </div>
  );
};

/* ============================================================
   PAGE: TEACHER - REVIEW AI RESULTS
   ============================================================ */
const TeacherReview = ({ onNavigate }) => {
  const concert = mockConcerts[0];
  const [performances, setPerformances] = useState(mockPerformances);
  const [showOriginal, setShowOriginal] = useState(true);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialStep, setSocialStep] = useState("select");
  const [selectedPlatforms, setSelectedPlatforms] = useState({ tiktok: false, xiaohongshu: false });

  const updatePerf = (id, field, value) => {
    setPerformances((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const addPerformer = () => {
    const newId = String(performances.length + 1);
    setPerformances((prev) => [
      ...prev,
      { id: newId, concert_id: "1", order: prev.length + 1, name: "", piece: "", instrument: "", grade: "", email: "", slot: "", duration: 0, confidence: "low" },
    ]);
  };

  const deletePerformer = (id) => {
    setPerformances((prev) => prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i + 1 })));
  };

  const allConfirmed = performances.every((p) => p.name && p.piece);
  const missingEmails = performances.filter((p) => !p.email);
  const noConflicts = true;
  const canPublish = allConfirmed && missingEmails.length === 0;

  return (
    <div>
      <button onClick={() => onNavigate("teacher-concerts")} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 14, marginBottom: 12, padding: 0 }}>
        ← Back to Concerts
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px 0" }}>Review Analysis Results</h2>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 20px 0" }}>{concert.title}</p>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Left: Original Input */}
        {showOriginal && (
          <div style={{ width: 220, flexShrink: 0 }}>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>📄 Original Input</span>
                <button onClick={() => setShowOriginal(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9ca3af", padding: 0 }}>×</button>
              </div>
              <pre style={{ fontSize: 12, color: "#374151", whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.6 }}>
                {concert.raw_input}
              </pre>
            </div>
          </div>
        )}

        {/* Right: Analysis Results Table */}
        <div style={{ flex: 1 }}>
          {!showOriginal && (
            <button onClick={() => setShowOriginal(true)} style={{ background: "none", border: "1px solid #d1d5db", borderRadius: 4, cursor: "pointer", fontSize: 12, padding: "4px 8px", marginBottom: 8 }}>
              📄 Show Original
            </button>
          )}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "8px 4px", textAlign: "left", fontWeight: 600 }}>#</th>
                  <th style={{ padding: "8px 4px", textAlign: "left", fontWeight: 600 }}>Name</th>
                  <th style={{ padding: "8px 4px", textAlign: "left", fontWeight: 600 }}>Piece</th>
                  <th style={{ padding: "8px 4px", textAlign: "left", fontWeight: 600 }}>Instrument</th>
                  <th style={{ padding: "8px 4px", textAlign: "left", fontWeight: 600 }}>Grade</th>
                  <th style={{ padding: "8px 4px", textAlign: "left", fontWeight: 600 }}>Email</th>
                  <th style={{ padding: "8px 4px", textAlign: "left", fontWeight: 600 }}>Duration</th>
                  <th style={{ padding: "8px 4px", textAlign: "left", fontWeight: 600 }}></th>
                </tr>
              </thead>
              <tbody>
                {performances.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "6px 4px", color: "#9ca3af" }}>
                      <span style={{ cursor: "grab" }}>⠿</span> {p.order}
                    </td>
                    <td style={{ padding: "6px 4px" }}>
                      <ConfidenceCell value={p.name} confidence={p.confidence} onChange={(v) => updatePerf(p.id, "name", v)} placeholder="Name" />
                    </td>
                    <td style={{ padding: "6px 4px" }}>
                      <ConfidenceCell value={p.piece} confidence={p.confidence} onChange={(v) => updatePerf(p.id, "piece", v)} placeholder="Piece" />
                    </td>
                    <td style={{ padding: "6px 4px" }}>
                      <ConfidenceCell value={p.instrument} confidence={p.confidence} onChange={(v) => updatePerf(p.id, "instrument", v)} placeholder="Instrument" />
                    </td>
                    <td style={{ padding: "6px 4px" }}>
                      <ConfidenceCell value={p.grade} confidence={p.confidence} onChange={(v) => updatePerf(p.id, "grade", v)} placeholder="Grade" />
                    </td>
                    <td style={{ padding: "6px 4px" }}>
                      <ConfidenceCell value={p.email} confidence={p.confidence} onChange={(v) => updatePerf(p.id, "email", v)} placeholder="Email" />
                    </td>
                    <td style={{ padding: "6px 4px", width: 50 }}>
                      <input
                        type="text"
                        value={p.duration ? `${p.duration}m` : ""}
                        onChange={(e) => updatePerf(p.id, "duration", parseInt(e.target.value) || 0)}
                        style={{ width: 40, padding: "4px 6px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13, textAlign: "center" }}
                      />
                    </td>
                    <td style={{ padding: "6px 4px" }}>
                      <button onClick={() => deletePerformer(p.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#ef4444" }}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7280", marginTop: 8, flexWrap: "wrap" }}>
            <span>⚠️ Yellow = AI Uncertain (Check)</span>
            <span>❌ Red = Missing Required Field</span>
            <span>✅ White = AI Confirmed</span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={addPerformer} style={{ padding: "6px 14px", background: "white", border: "1px solid #2563eb", color: "#2563eb", borderRadius: 6, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
                + Add Performer
              </button>
            </div>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>↕ Drag to reorder</span>
          </div>
        </div>
      </div>

      {/* Pre-publication Check */}
      <div style={{ marginTop: 24, padding: 16, background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Pre-publication Check:</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span>{allConfirmed ? "✅" : "❌"} All performers have name and piece</span>
          <span>{missingEmails.length === 0 ? "✅" : "❌"} {missingEmails.length > 0 ? `Row ${missingEmails.map((p) => p.order).join(", ")} missing email (Cannot send notifications)` : "All emails filled"}</span>
          <span>{noConflicts ? "✅" : "❌"} No schedule conflicts</span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "8px 20px", background: "white", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, cursor: "pointer" }}>
            Save Draft
          </button>
          <button style={{ padding: "8px 20px", background: "white", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, cursor: "pointer" }}>
            Re-analyze
          </button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowSocialModal(true)}
            style={{ padding: "8px 20px", background: "white", border: "1px solid #8b5cf6", color: "#8b5cf6", borderRadius: 6, fontSize: 14, cursor: "pointer", fontWeight: 500 }}
          >
            📱 Social Media Preview
          </button>
          <button
            disabled={!canPublish}
            style={{
              padding: "8px 24px",
              background: canPublish ? "#2563eb" : "#9ca3af",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: canPublish ? "pointer" : "not-allowed",
              opacity: canPublish ? 1 : 0.7,
            }}
          >
            Confirm & Publish
          </button>
        </div>
      </div>

      {/* Social Media Modal */}
      {showSocialModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 12, padding: 24, width: 440, maxHeight: "80vh", overflow: "auto" }}>
            {socialStep === "select" ? (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px 0" }}>Select Publishing Platform</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8 }}>
                    <input type="checkbox" checked={selectedPlatforms.tiktok} onChange={() => setSelectedPlatforms((p) => ({ ...p, tiktok: !p.tiktok }))} />
                    <span style={{ fontSize: 20 }}>🎵</span>
                    <span style={{ fontWeight: 500 }}>TikTok</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8 }}>
                    <input type="checkbox" checked={selectedPlatforms.xiaohongshu} onChange={() => setSelectedPlatforms((p) => ({ ...p, xiaohongshu: !p.xiaohongshu }))} />
                    <span style={{ fontSize: 20 }}>📕</span>
                    <span style={{ fontWeight: 500 }}>小红书 (Xiaohongshu)</span>
                  </label>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button onClick={() => { setShowSocialModal(false); setSocialStep("select"); }} style={{ padding: "8px 20px", background: "white", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button
                    onClick={() => setSocialStep("preview")}
                    disabled={!selectedPlatforms.tiktok && !selectedPlatforms.xiaohongshu}
                    style={{
                      padding: "8px 20px",
                      background: (selectedPlatforms.tiktok || selectedPlatforms.xiaohongshu) ? "#2563eb" : "#9ca3af",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: (selectedPlatforms.tiktok || selectedPlatforms.xiaohongshu) ? "pointer" : "not-allowed",
                    }}
                  >
                    Generate Preview
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0" }}>
                  {selectedPlatforms.tiktok ? "Publish to TikTok" : "发布到小红书"}
                </h3>
                <div style={{ background: "#eff6ff", borderRadius: 6, padding: 10, fontSize: 12, color: "#1e40af", marginBottom: 16 }}>
                  ℹ️ Review the auto-generated caption. Click publish to copy and open the platform.
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Caption</label>
                  <textarea
                    rows={8}
                    defaultValue={`🎵 ${concert.title} 🌟\n📅 ${new Date(concert.start_time).toLocaleDateString("en-US", { month: "long", day: "numeric" })}, ${new Date(concert.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}\n📍 ${concert.type === "ONLINE" ? "Zoom Online Live" : concert.venue_name}\n\n✨ Program Highlights ✨\n${performances.map((p) => `${p.instrument ? (p.instrument === "Piano" ? "🎹" : "🎻") : "🎵"} ${p.name} - ${p.piece}`).join("\n")}\n\n🎶 Come join us!`}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Tags</label>
                  <input
                    type="text"
                    defaultValue="#MusicRecital #Piano #Violin #Spring2026 #LiveMusic"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button onClick={() => setSocialStep("select")} style={{ padding: "8px 20px", background: "white", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, cursor: "pointer" }}>
                    ← Back
                  </button>
                  <button
                    onClick={() => { setShowSocialModal(false); setSocialStep("select"); }}
                    style={{ padding: "8px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                  >
                    📋 Copy & Open {selectedPlatforms.tiktok ? "TikTok" : "小红书"} →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   PAGE: STUDENT - SCHEDULE
   ============================================================ */
const StudentSchedule = ({ onNavigate }) => {
  const [tab, setTab] = useState("upcoming");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Hi, Emma! 👋</h2>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid #e5e7eb" }}>
        {[
          { key: "upcoming", label: "📋 Upcoming", count: mockStudentPerformances.upcoming.length },
          { key: "completed", label: "📁 Completed", count: mockStudentPerformances.completed.length },
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

                {/* Online specific */}
                {p.type === "ONLINE" && (
                  <div style={{ background: "#eff6ff", borderRadius: 6, padding: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 13, color: "#1e40af", marginBottom: 8 }}>You are performer #{p.order} — wait for your turn</div>
                    <button style={{ padding: "8px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                      Join Zoom 🔗
                    </button>
                  </div>
                )}

                {/* Offline specific */}
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
};

/* ============================================================
   NAV BAR
   ============================================================ */
const NavBar = ({ currentPage, onNavigate }) => {
  const isTeacher = currentPage.startsWith("teacher");
  const isStudent = currentPage.startsWith("student");

  if (currentPage === "home") return null;

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", background: "white", borderBottom: "1px solid #e5e7eb", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span onClick={() => onNavigate("home")} style={{ fontSize: 22, cursor: "pointer" }}>🎵</span>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>MusicNBrain</span>
        {isTeacher && (
          <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
            Teacher
          </span>
        )}
        {isStudent && (
          <span style={{ background: "#d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
            Student
          </span>
        )}
      </div>
      <button
        onClick={() => onNavigate("home")}
        style={{ background: "none", border: "1px solid #d1d5db", borderRadius: 6, padding: "4px 12px", fontSize: 13, cursor: "pointer", color: "#6b7280" }}
      >
        Logout
      </button>
    </div>
  );
};

/* ============================================================
   APP ROOT
   ============================================================ */
export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage onNavigate={setPage} />;
      case "teacher-concerts":
        return <TeacherConcertList onNavigate={setPage} />;
      case "teacher-create":
        return <TeacherCreateConcert onNavigate={setPage} />;
      case "teacher-review":
        return <TeacherReview onNavigate={setPage} />;
      case "student-schedule":
        return <StudentSchedule onNavigate={setPage} />;
      default:
        return <HomePage onNavigate={setPage} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <NavBar currentPage={page} onNavigate={setPage} />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 40px 24px" }}>
        {renderPage()}
      </div>
    </div>
  );
}
