"use client";

import { useState } from "react";
import Link from "next/link";
import { ConfidenceCell } from "@/components/shared";
import { mockConcerts, mockPerformances as initialPerformances } from "@/lib/mock-data";
import { Performance } from "@/types";

export default function TeacherReviewPage() {
  const concert = mockConcerts[0];
  const [performances, setPerformances] = useState<Performance[]>(initialPerformances);
  const [showOriginal, setShowOriginal] = useState(true);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialStep, setSocialStep] = useState<"select" | "preview">("select");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    tiktok: false,
    xiaohongshu: false,
  });

  const updatePerf = (id: string, field: keyof Performance, value: string | number) => {
    setPerformances((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const addPerformer = () => {
    const newId = String(Date.now());
    setPerformances((prev) => [
      ...prev,
      {
        id: newId,
        concert_id: "1",
        order: prev.length + 1,
        name: "",
        piece: "",
        instrument: "",
        grade: "",
        email: "",
        slot: "",
        duration: 0,
        confidence: "low" as const,
      },
    ]);
  };

  const deletePerformer = (id: string) => {
    setPerformances((prev) =>
      prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i + 1 }))
    );
  };

  const allConfirmed = performances.every((p) => p.name && p.piece);
  const missingEmails = performances.filter((p) => !p.email);
  const noConflicts = true;
  const canPublish = allConfirmed && missingEmails.length === 0;

  return (
    <div>
      <Link
        href="/teacher/concerts"
        style={{
          color: "#2563eb",
          fontSize: 14,
          marginBottom: 12,
          display: "inline-block",
          textDecoration: "none",
        }}
      >
        ← Back to Concerts
      </Link>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px 0" }}>
        Review Analysis Results
      </h2>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 20px 0" }}>
        {concert.title}
      </p>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Left: Original Input */}
        {showOriginal && (
          <div style={{ width: 220, flexShrink: 0 }}>
            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>📄 Original Input</span>
                <button
                  onClick={() => setShowOriginal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#9ca3af",
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
              <pre
                style={{
                  fontSize: 12,
                  color: "#374151",
                  whiteSpace: "pre-wrap",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {concert.raw_input}
              </pre>
            </div>
          </div>
        )}

        {/* Right: Analysis Results Table */}
        <div style={{ flex: 1 }}>
          {!showOriginal && (
            <button
              onClick={() => setShowOriginal(true)}
              style={{
                background: "none",
                border: "1px solid #d1d5db",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                padding: "4px 8px",
                marginBottom: 8,
              }}
            >
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
                      <button onClick={() => deletePerformer(p.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#ef4444" }}>
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7280", marginTop: 8, flexWrap: "wrap" }}>
            <span>⚠️ Yellow = AI Uncertain</span>
            <span>❌ Red = Missing Required</span>
            <span>✅ White = AI Confirmed</span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <button onClick={addPerformer} style={{ padding: "6px 14px", background: "white", border: "1px solid #2563eb", color: "#2563eb", borderRadius: 6, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
              + Add Performer
            </button>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>↕ Drag to reorder</span>
          </div>
        </div>
      </div>

      {/* Pre-publication Check */}
      <div style={{ marginTop: 24, padding: 16, background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Pre-publication Check:</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span>{allConfirmed ? "✅" : "❌"} All performers have name and piece</span>
          <span>
            {missingEmails.length === 0 ? "✅" : "❌"}{" "}
            {missingEmails.length > 0
              ? `Row ${missingEmails.map((p) => p.order).join(", ")} missing email`
              : "All emails filled"}
          </span>
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
            📱 Social Media
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
                      background: selectedPlatforms.tiktok || selectedPlatforms.xiaohongshu ? "#2563eb" : "#9ca3af",
                      color: "white", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600,
                      cursor: selectedPlatforms.tiktok || selectedPlatforms.xiaohongshu ? "pointer" : "not-allowed",
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
                  ℹ️ Review the auto-generated caption below.
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Caption</label>
                  <textarea
                    rows={8}
                    defaultValue={`🎵 ${concert.title} 🌟\n📅 ${new Date(concert.start_time).toLocaleDateString("en-US", { month: "long", day: "numeric" })}\n📍 ${concert.type === "ONLINE" ? "Zoom Online Live" : concert.venue_name}\n\n✨ Program ✨\n${performances.map((p) => `${p.instrument === "Piano" ? "🎹" : p.instrument === "Violin" ? "🎻" : "🎵"} ${p.name} - ${p.piece}`).join("\n")}\n\n🎶 Come join us!`}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Tags</label>
                  <input type="text" defaultValue="#MusicRecital #Piano #Violin #Spring2026" style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, boxSizing: "border-box" }} />
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
}
