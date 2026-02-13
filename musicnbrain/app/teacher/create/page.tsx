"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TeacherCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    type: "OFFLINE" as "ONLINE" | "OFFLINE",
    start_time: "2026-03-15T14:00",
    duration: 120,
    venue_name: "",
    venue_address: "",
    raw_input: "",
  });

  const update = (field: string, value: string | number) =>
    setForm((p) => ({ ...p, [field]: value }));

  const endTime = (() => {
    if (!form.start_time || !form.duration) return "";
    const d = new Date(form.start_time);
    d.setMinutes(d.getMinutes() + Number(form.duration));
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  })();

  const handleSubmit = () => {
    // TODO: Call AI parsing API, then navigate to review page
    router.push("/teacher/review/1");
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
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
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        Create New Concert
      </h2>

      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 6,
            color: "#374151",
          }}
        >
          Title
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g., Spring Recital 2026"
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Time Settings */}
      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "#9ca3af",
          marginBottom: 12,
        }}
      >
        —— Time Settings ——
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 8,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 6,
              color: "#374151",
            }}
          >
            Start Time
          </label>
          <input
            type="datetime-local"
            value={form.start_time}
            onChange={(e) => update("start_time", e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 6,
              color: "#374151",
            }}
          >
            Duration (minutes)
          </label>
          <select
            value={form.duration}
            onChange={(e) => update("duration", Number(e.target.value))}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          >
            {[60, 90, 120, 150, 180].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
      {endTime && (
        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>
          Expected end: {endTime}
        </div>
      )}

      {/* Venue Settings */}
      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "#9ca3af",
          marginBottom: 12,
        }}
      >
        —— Venue Settings ——
      </div>
      <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          <input
            type="radio"
            checked={form.type === "OFFLINE"}
            onChange={() => update("type", "OFFLINE")}
          />
          Offline Venue
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          <input
            type="radio"
            checked={form.type === "ONLINE"}
            onChange={() => update("type", "ONLINE")}
          />
          Online Live (Zoom auto-generated)
        </label>
      </div>

      {form.type === "OFFLINE" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 6,
                color: "#374151",
              }}
            >
              Venue Name
            </label>
            <input
              type="text"
              value={form.venue_name}
              onChange={(e) => update("venue_name", e.target.value)}
              placeholder="e.g., Boston Concert Hall"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 6,
                color: "#374151",
              }}
            >
              Venue Address
            </label>
            <input
              type="text"
              value={form.venue_address}
              onChange={(e) => update("venue_address", e.target.value)}
              placeholder="e.g., 123 Main St, Boston"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      )}

      {form.type === "ONLINE" && (
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 6,
            padding: 12,
            marginBottom: 20,
            fontSize: 13,
            color: "#1e40af",
          }}
        >
          ℹ️ Zoom meeting link will be automatically generated when you publish
          this concert.
        </div>
      )}

      {/* Program List Source */}
      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "#9ca3af",
          marginBottom: 12,
        }}
      >
        —— Program List Source (Multimodal Input) ——
      </div>
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
        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
          Drag and drop files here, paste text, or click buttons below
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <button
            style={{
              padding: "6px 16px",
              background: "white",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            📄 Upload PDF/Image/Excel
          </button>
          <button
            style={{
              padding: "6px 16px",
              background: "white",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            🔗 Input URL
          </button>
        </div>
        <textarea
          value={form.raw_input}
          onChange={(e) => update("raw_input", e.target.value)}
          placeholder="Or paste text/CSV/email content here..."
          rows={5}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 13,
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24 }}>
        Supported: PDF, JPG/PNG images, CSV/Excel, Web links, plain text
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "12px 0",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        ⚡ Submit & Start AI Analysis
      </button>
    </div>
  );
}
