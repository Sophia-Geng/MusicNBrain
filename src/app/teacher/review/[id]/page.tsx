// Copyright (c) 2025 MusicNBrain Media Lab. All Rights Reserved.
// Unauthorized use, copying, or distribution is prohibited.
// Contact: developer@musicnbrain.org

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { mockConcerts, mockPerformances as initialPerformances } from "@/lib/mock-data";
import { Performance } from "@/types";

/* ─── helper: check if a performer has missing info ─── */
function getMissingFields(p: Performance): string[] {
  const missing: string[] = [];
  if (!p.name) missing.push("Name");
  if (!p.piece) missing.push("Piece");
  if (!p.instrument) missing.push("Instrument");
  if (!p.email) missing.push("Email");
  if (!p.duration) missing.push("Duration");
  return missing;
}

/* ─── Performer Card (preview mode) ─── */
function PerformerPreview({
  perf,
  isFirst,
  isLast,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragOver,
  isDragging,
}: {
  perf: Performance;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragOver: boolean;
  isDragging: boolean;
}) {
  const missing = getMissingFields(perf);
  const hasMissing = missing.length > 0;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      style={{
        background: "white",
        border: isDragOver
          ? "2px solid #2563eb"
          : hasMissing
          ? "2px solid #fbbf24"
          : "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "20px 24px",
        position: "relative",
        opacity: isDragging ? 0.4 : 1,
        transition: "border-color 0.15s, opacity 0.15s",
        cursor: "default",
      }}
    >
      {/* Top row: drag handle + order number + reorder/delete */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Drag handle */}
          <span
            style={{
              cursor: "grab",
              fontSize: 18,
              color: "#9ca3af",
              userSelect: "none",
              padding: "2px 4px",
              lineHeight: 1,
            }}
            title="Drag to reorder"
          >
            ⠿
          </span>
          <span
            style={{
              background: "#eff6ff",
              color: "#2563eb",
              fontWeight: 700,
              fontSize: 14,
              padding: "4px 12px",
              borderRadius: 20,
            }}
          >
            # {perf.order}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move up"
            style={{
              background: "none",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              width: 32,
              height: 32,
              cursor: isFirst ? "default" : "pointer",
              opacity: isFirst ? 0.3 : 1,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            title="Move down"
            style={{
              background: "none",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              width: 32,
              height: 32,
              cursor: isLast ? "default" : "pointer",
              opacity: isLast ? 0.3 : 1,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ↓
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            style={{
              background: "none",
              border: "1px solid #fca5a5",
              borderRadius: 6,
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 14,
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🗑
          </button>
        </div>
      </div>

      {/* Main info */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          👤 {perf.name || <span style={{ color: "#ef4444" }}>(No name)</span>}
          {perf.instrument && (
            <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 15, marginLeft: 8 }}>
              · {perf.instrument}
            </span>
          )}
        </div>
        <div style={{ fontSize: 16, color: "#374151", marginBottom: 4 }}>
          🎵 {perf.piece || <span style={{ color: "#ef4444" }}>(No piece)</span>}
        </div>
        <div style={{ fontSize: 14, color: "#6b7280" }}>
          ⏱ {perf.duration ? `${perf.duration} min` : <span style={{ color: "#ef4444" }}>(No duration)</span>}
          {perf.grade && <span style={{ marginLeft: 12 }}>📊 Grade {perf.grade}</span>}
          {perf.email && <span style={{ marginLeft: 12 }}>📧 {perf.email}</span>}
        </div>
      </div>

      {/* Warning bar for missing info */}
      {hasMissing && (
        <div
          style={{
            background: "#fef9c3",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 14,
            color: "#92400e",
            marginTop: 12,
          }}
        >
          ⚠️ Missing: {missing.join(", ")}
        </div>
      )}

      {/* Edit button */}
      <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onEdit}
          style={{
            padding: "8px 20px",
            background: "#f3f4f6",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
            fontWeight: 500,
            color: "#374151",
          }}
        >
          ✏️ Edit
        </button>
      </div>
    </div>
  );
}

/* ─── Performer Card (edit mode) ─── */
function PerformerEdit({
  perf,
  onSave,
  onCancel,
}: {
  perf: Performance;
  onSave: (updated: Performance) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Performance>({ ...perf });

  const update = (field: keyof Performance, value: string | number) =>
    setDraft((p) => ({ ...p, [field]: value }));

  const fieldStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 15,
    boxSizing: "border-box" as const,
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: 14,
    fontWeight: 600 as const,
    marginBottom: 6,
    color: "#374151",
  };

  return (
    <div
      style={{
        background: "#fefce8",
        border: "2px solid #fbbf24",
        borderRadius: 12,
        padding: "20px 24px",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, color: "#92400e", marginBottom: 16 }}>
        ✏️ Editing Performer #{perf.order}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>
              👤 Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Student name"
              style={fieldStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>🎹 Instrument</label>
            <input
              type="text"
              value={draft.instrument}
              onChange={(e) => update("instrument", e.target.value)}
              placeholder="e.g. Piano, Violin"
              style={fieldStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>
            🎵 Piece <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            value={draft.piece}
            onChange={(e) => update("piece", e.target.value)}
            placeholder="Piece name"
            style={fieldStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>⏱ Duration (minutes)</label>
            <input
              type="number"
              value={draft.duration || ""}
              onChange={(e) => update("duration", parseInt(e.target.value) || 0)}
              placeholder="Minutes"
              style={fieldStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>📊 Grade</label>
            <input
              type="text"
              value={draft.grade}
              onChange={(e) => update("grade", e.target.value)}
              placeholder="e.g. 5, 8"
              style={fieldStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>📧 Email</label>
          <input
            type="email"
            value={draft.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="student@email.com"
            style={fieldStyle}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
        <button
          onClick={onCancel}
          style={{
            padding: "10px 24px",
            background: "white",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
            color: "#6b7280",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(draft)}
          style={{
            padding: "10px 24px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ✅ Save
        </button>
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
  concert: typeof mockConcerts[0];
  performances: Performance[];
  onClose: () => void;
}) {
  const [step, setStep] = useState<"select" | "preview">("select");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    tiktok: false,
    xiaohongshu: false,
  });

  const anySelected = selectedPlatforms.tiktok || selectedPlatforms.xiaohongshu;

  const generatedCaption = `🎵 ${concert.title} 🌟\n📅 ${new Date(concert.start_time).toLocaleDateString("en-US", { month: "long", day: "numeric" })}\n📍 ${concert.type === "ONLINE" ? "Zoom Online Live" : concert.venue_name}\n\n✨ Program ✨\n${performances.map((p) => `${p.instrument === "Piano" ? "🎹" : p.instrument === "Violin" ? "🎻" : "🎵"} ${p.name} - ${p.piece}`).join("\n")}\n\n🎶 Come join us!`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 28,
          width: 460,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        {step === "select" ? (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px 0" }}>
              📱 Share on Social Media
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  padding: "12px 16px",
                  border: selectedPlatforms.tiktok ? "2px solid #2563eb" : "1px solid #e5e7eb",
                  borderRadius: 12,
                  background: selectedPlatforms.tiktok ? "#eff6ff" : "white",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedPlatforms.tiktok}
                  onChange={() => setSelectedPlatforms((p) => ({ ...p, tiktok: !p.tiktok }))}
                  style={{ width: 18, height: 18 }}
                />
                <span style={{ fontSize: 22 }}>🎵</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>TikTok</span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  padding: "12px 16px",
                  border: selectedPlatforms.xiaohongshu ? "2px solid #2563eb" : "1px solid #e5e7eb",
                  borderRadius: 12,
                  background: selectedPlatforms.xiaohongshu ? "#eff6ff" : "white",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedPlatforms.xiaohongshu}
                  onChange={() => setSelectedPlatforms((p) => ({ ...p, xiaohongshu: !p.xiaohongshu }))}
                  style={{ width: 18, height: 18 }}
                />
                <span style={{ fontSize: 22 }}>📕</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Xiaohongshu (小红书)</span>
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  padding: "10px 24px",
                  background: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setStep("preview")}
                disabled={!anySelected}
                style={{
                  padding: "10px 24px",
                  background: anySelected ? "#2563eb" : "#9ca3af",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: anySelected ? "pointer" : "not-allowed",
                }}
              >
                Generate Preview
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px 0" }}>
              {selectedPlatforms.tiktok ? "Post to TikTok" : "Post to Xiaohongshu"}
            </h3>
            <div
              style={{
                background: "#eff6ff",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#1e40af",
                marginBottom: 20,
              }}
            >
              ℹ️ Review the auto-generated caption below. Edit if needed.
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                Caption
              </label>
              <textarea
                rows={8}
                defaultValue={generatedCaption}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 14,
                  resize: "vertical",
                  boxSizing: "border-box",
                  lineHeight: 1.6,
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                Tags
              </label>
              <input
                type="text"
                defaultValue="#MusicRecital #Piano #Violin #Spring2026"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setStep("select")}
                style={{
                  padding: "10px 24px",
                  background: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "10px 24px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📋 Copy & Open {selectedPlatforms.tiktok ? "TikTok" : "Xiaohongshu"} →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function TeacherReviewPage() {
  const concert = mockConcerts[0];
  const [performances, setPerformances] = useState<Performance[]>(initialPerformances);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSocialModal, setShowSocialModal] = useState(false);

  /* ── drag state ── */
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    const from = dragIndexRef.current;
    const to = dragOverIndex;

    if (from !== null && to !== null && from !== to) {
      setPerformances((prev) => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next.map((p, i) => ({ ...p, order: i + 1 }));
      });
    }

    dragIndexRef.current = null;
    setDragOverIndex(null);
    setDraggingIndex(null);
  };

  /* ── actions ── */
  const handleSave = (updated: Performance) => {
    setPerformances((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditingId(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setPerformances((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((p, i) => ({ ...p, order: i + 1 }));
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === performances.length - 1) return;
    setPerformances((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((p, i) => ({ ...p, order: i + 1 }));
    });
  };

  const handleDelete = (id: string) => {
    setPerformances((prev) =>
      prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i + 1 }))
    );
    if (editingId === id) setEditingId(null);
  };

  const handleAdd = () => {
    const newId = String(Date.now());
    setPerformances((prev) => [
      ...prev,
      {
        id: newId,
        concert_id: concert.id,
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
    setEditingId(newId);
  };

  /* ── pre-publish check ── */
  const incompleteCount = performances.filter(
    (p) => getMissingFields(p).length > 0
  ).length;
  const canPublish =
    performances.length > 0 && performances.every((p) => p.name && p.piece);

  /* ── total duration ── */
  const totalMinutes = performances.reduce(
    (sum, p) => sum + (p.duration || 0),
    0
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Back link */}
      <Link
        href="/teacher/concerts"
        style={{
          color: "#2563eb",
          fontSize: 14,
          marginBottom: 16,
          display: "inline-block",
          textDecoration: "none",
        }}
      >
        ← Back to Concerts
      </Link>

      {/* Concert header */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "32px 28px 24px",
          textAlign: "center",
          marginBottom: 24,
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
          🎵 Concert Program Preview
        </div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#111827",
            margin: "0 0 8px 0",
          }}
        >
          {concert.title}
        </h1>
        <div style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.8 }}>
          📅{" "}
          {new Date(concert.start_time).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {new Date(concert.start_time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          <br />
          {concert.type === "ONLINE"
            ? "🌐 Online (Zoom)"
            : `📍 ${concert.venue_name}`}
          {" · "}
          {concert.duration} min
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "10px 16px",
            background: "#eff6ff",
            borderRadius: 10,
            fontSize: 14,
            color: "#1e40af",
            display: "inline-block",
          }}
        >
          🤖 AI organized {performances.length} performers for you — please review
        </div>
      </div>

      {/* Drag hint */}
      <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 10, marginLeft: 16, paddingLeft: 20 }}>
        💡 Drag ⠿ to reorder, or use ↑↓ buttons
      </div>

      {/* Performer cards */}
      <div
        style={{
          borderLeft: "3px solid #e5e7eb",
          marginLeft: 16,
          paddingLeft: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {performances.map((perf, index) =>
          editingId === perf.id ? (
            <PerformerEdit
              key={perf.id}
              perf={perf}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <PerformerPreview
              key={perf.id}
              perf={perf}
              isFirst={index === 0}
              isLast={index === performances.length - 1}
              onEdit={() => setEditingId(perf.id)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onDelete={() => handleDelete(perf.id)}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              isDragOver={dragOverIndex === index && draggingIndex !== index}
              isDragging={draggingIndex === index}
            />
          )
        )}
      </div>

      {/* Add performer */}
      <div style={{ marginTop: 16, marginLeft: 16, paddingLeft: 20 }}>
        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            padding: "14px 0",
            background: "white",
            border: "2px dashed #93c5fd",
            borderRadius: 12,
            fontSize: 15,
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          + Add Performer
        </button>
      </div>

      {/* Summary bar */}
      <div
        style={{
          marginTop: 24,
          padding: "16px 20px",
          background: "white",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          fontSize: 14,
          color: "#374151",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span>📋 {performances.length} performers</span>
          <span>⏱ ~{totalMinutes} min total</span>
        </div>

        {incompleteCount > 0 && (
          <div
            style={{
              background: "#fef9c3",
              padding: "8px 12px",
              borderRadius: 8,
              color: "#92400e",
              fontSize: 14,
            }}
          >
            ⚠️ {incompleteCount} performer{incompleteCount > 1 ? "s" : ""} still missing some info
          </div>
        )}

        {incompleteCount === 0 && (
          <div
            style={{
              background: "#d1fae5",
              padding: "8px 12px",
              borderRadius: 8,
              color: "#065f46",
              fontSize: 14,
            }}
          >
            ✅ All performer info is complete
          </div>
        )}
      </div>

      {/* Bottom action buttons */}
      <div style={{ display: "flex", gap: 10, marginTop: 16, marginBottom: 40 }}>
        <button
          onClick={() => setShowSocialModal(true)}
          style={{
            padding: "14px 20px",
            background: "white",
            border: "1px solid #8b5cf6",
            color: "#8b5cf6",
            borderRadius: 12,
            fontSize: 15,
            cursor: "pointer",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          📱 Share
        </button>

        <button
          disabled={!canPublish}
          style={{
            flex: 1,
            padding: "14px 0",
            background: canPublish ? "#2563eb" : "#9ca3af",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 17,
            fontWeight: 700,
            cursor: canPublish ? "pointer" : "not-allowed",
            opacity: canPublish ? 1 : 0.7,
          }}
        >
          {canPublish ? "Confirm & Publish 🎉" : "Please complete all info first"}
        </button>
      </div>

      {/* Social Media Modal */}
      {showSocialModal && (
        <SocialMediaModal
          concert={concert}
          performances={performances}
          onClose={() => setShowSocialModal(false)}
        />
      )}
    </div>
  );
}
